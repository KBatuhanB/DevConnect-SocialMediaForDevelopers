import { AppError } from "../../core/errors/app-error";
import { createUserSupabaseClient } from "../../core/supabase/client";
import { messagesConfig } from "./config";
import type {
  ConversationSummary,
  MessageCursor,
  MessagePartner,
  MessageView,
  MessagesContext,
  PreparedSendMessageInput
} from "./types";

type UserSupabaseClient = ReturnType<typeof createUserSupabaseClient>;

type ProfileRow = {
  id: string;
  username: string;
  avatar_path: string | null;
};

type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

function buildAvatarUrl(avatarPath: string | null) {
  return avatarPath ? `${messagesConfig.profile.avatarPublicBaseUrl}/${avatarPath}` : null;
}

function mapPartner(row: ProfileRow): MessagePartner {
  return {
    id: row.id,
    username: row.username,
    avatarPath: row.avatar_path,
    avatarUrl: buildAvatarUrl(row.avatar_path)
  };
}

function mapMessageView(row: MessageRow, userId: string): MessageView {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    isMine: row.sender_id === userId
  };
}

function buildConversationFilter(userId: string, partnerId: string) {
  return [
    `and(sender_id.eq.${userId},receiver_id.eq.${partnerId})`,
    `and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`
  ].join(",");
}

function buildConversationCursorFilter(userId: string, partnerId: string, cursor: MessageCursor) {
  return [
    `and(sender_id.eq.${userId},receiver_id.eq.${partnerId},created_at.lt.${cursor.createdAt})`,
    `and(sender_id.eq.${partnerId},receiver_id.eq.${userId},created_at.lt.${cursor.createdAt})`,
    `and(sender_id.eq.${userId},receiver_id.eq.${partnerId},created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`,
    `and(sender_id.eq.${partnerId},receiver_id.eq.${userId},created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
  ].join(",");
}

async function readProfilesByIds(supabase: UserSupabaseClient, profileIds: string[]) {
  if (profileIds.length === 0) {
    return new Map<string, MessagePartner>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(messagesConfig.columns.profile)
    .in("id", profileIds)
    .returns<ProfileRow[]>();

  if (error) {
    throw new AppError({
      statusCode: 500,
      code: "MESSAGE_PROFILE_READ_FAILED",
      message: "Mesaj profilleri su an okunamadi."
    });
  }

  return new Map((data ?? []).map((row) => [row.id, mapPartner(row)]));
}

async function readUnreadCounts(supabase: UserSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("receiver_id", userId)
    .eq("is_read", false)
    .returns<Array<{ sender_id: string }>>();

  if (error) {
    throw new AppError({
      statusCode: 500,
      code: "MESSAGE_UNREAD_COUNT_FAILED",
      message: "Okunmamis mesaj sayisi su an okunamadi."
    });
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    counts.set(row.sender_id, (counts.get(row.sender_id) ?? 0) + 1);
  }

  return counts;
}

async function readFollowingIds(supabase: UserSupabaseClient, userId: string, limit: number) {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Array<{ following_id: string }>>();

  if (error) {
    throw new AppError({
      statusCode: 500,
      code: "MESSAGE_FOLLOWING_READ_FAILED",
      message: "Takip edilen profiller su an okunamadi."
    });
  }

  const seenIds = new Set<string>();

  return (data ?? [])
    .map((row) => row.following_id)
    .filter((id) => {
      if (seenIds.has(id)) {
        return false;
      }

      seenIds.add(id);
      return true;
    });
}

export function createMessagesRepository() {
  return {
    async findProfileById(context: MessagesContext, profileId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("profiles")
        .select(messagesConfig.columns.profile)
        .eq("id", profileId)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "MESSAGE_PROFILE_READ_FAILED",
          message: "Mesaj profili su an okunamadi."
        });
      }

      return data ? mapPartner(data) : null;
    },

    async findConversations(context: MessagesContext, limit: number): Promise<ConversationSummary[]> {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("messages")
        .select(messagesConfig.columns.message)
        .or(`sender_id.eq.${context.userId},receiver_id.eq.${context.userId}`)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(messagesConfig.limits.conversationCandidateLimit)
        .returns<MessageRow[]>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "MESSAGE_CONVERSATIONS_READ_FAILED",
          message: "Konusma listesi su an okunamadi."
        });
      }

      const latestMessages = new Map<string, MessageRow>();

      for (const row of data ?? []) {
        const partnerId = row.sender_id === context.userId ? row.receiver_id : row.sender_id;

        if (!latestMessages.has(partnerId)) {
          latestMessages.set(partnerId, row);
        }

        if (latestMessages.size >= limit) {
          break;
        }
      }

      const partnerIds = Array.from(latestMessages.keys());
      const [profilesById, unreadCounts] = await Promise.all([
        readProfilesByIds(supabase, partnerIds),
        readUnreadCounts(supabase, context.userId)
      ]);

      const conversations: ConversationSummary[] = [];

      for (const partnerId of partnerIds) {
        const lastMessage = latestMessages.get(partnerId);
        const partner = profilesById.get(partnerId);

        if (!lastMessage || !partner) {
          continue;
        }

        conversations.push({
          partner,
          lastMessage: mapMessageView(lastMessage, context.userId),
          unreadCount: unreadCounts.get(partnerId) ?? 0,
          updatedAt: lastMessage.created_at
        });
      }

      return conversations;
    },

    async findFollowingProfiles(context: MessagesContext, limit: number) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const followingIds = await readFollowingIds(supabase, context.userId, limit);
      const profilesById = await readProfilesByIds(supabase, followingIds);

      return followingIds
        .map((profileId) => profilesById.get(profileId) ?? null)
        .filter((profile): profile is MessagePartner => profile !== null);
    },

    async findConversationMessages(context: MessagesContext, input: { partnerId: string; cursor: MessageCursor | null; limit: number }) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const filter = input.cursor
        ? buildConversationCursorFilter(context.userId, input.partnerId, input.cursor)
        : buildConversationFilter(context.userId, input.partnerId);
      const { data, error } = await supabase
        .from("messages")
        .select(messagesConfig.columns.message)
        .or(filter)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(input.limit)
        .returns<MessageRow[]>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "MESSAGE_HISTORY_READ_FAILED",
          message: "Mesaj gecmisi su an okunamadi."
        });
      }

      return (data ?? []).map((row) => mapMessageView(row, context.userId));
    },

    async createMessage(context: MessagesContext, input: PreparedSendMessageInput) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: context.userId,
          receiver_id: input.receiverId,
          content: input.content
        })
        .select(messagesConfig.columns.message)
        .maybeSingle<MessageRow>();

      if (error || !data) {
        throw new AppError({
          statusCode: 500,
          code: "MESSAGE_CREATE_FAILED",
          message: "Mesaj su an gonderilemedi."
        });
      }

      return mapMessageView(data, context.userId);
    },

    async markConversationAsRead(context: MessagesContext, partnerId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("messages")
        .update({
          is_read: true
        })
        .eq("receiver_id", context.userId)
        .eq("sender_id", partnerId)
        .eq("is_read", false)
        .select("id")
        .returns<Array<{ id: string }>>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "MESSAGE_MARK_READ_FAILED",
          message: "Okundu durumu su an guncellenemedi."
        });
      }

      return data?.length ?? 0;
    }
  };
}