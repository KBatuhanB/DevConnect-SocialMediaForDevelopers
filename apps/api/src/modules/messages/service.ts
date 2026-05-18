import { AppError } from "../../core/errors/app-error";
import { messagesConfig } from "./config";
import type {
  MessageCursor,
  MessageHistoryPage,
  MessagesSidebarData,
  MessageView,
  MessagesContext,
  MessagesRepository,
  SendMessageInput
} from "./types";

function normalizeMessageContent(content: string) {
  return content.replace(/\r\n/g, "\n").split(String.fromCharCode(0)).join("").trim();
}

function ensureOtherParticipant(context: MessagesContext, partnerId: string) {
  if (partnerId === context.userId) {
    throw new AppError({
      statusCode: 400,
      code: "MESSAGE_SELF_NOT_ALLOWED",
      message: "Kendine mesaj gonderemezsin."
    });
  }
}

function createCursor(item: MessageView | undefined): MessageCursor | null {
  return item
    ? {
        createdAt: item.createdAt,
        id: item.id
      }
    : null;
}

function dedupeMessages(items: MessageView[]) {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
}

export function createMessagesService(repository: MessagesRepository) {
  return {
    async getConversations(context: MessagesContext): Promise<MessagesSidebarData> {
      const [conversations, followingProfiles] = await Promise.all([
        repository.findConversations(context, messagesConfig.limits.conversationListSize),
        repository.findFollowingProfiles(context, messagesConfig.limits.followingCandidateLimit)
      ]);
      const recentConversationIds = new Set(conversations.map((conversation) => conversation.partner.id));

      return {
        conversations,
        followingProfiles: followingProfiles
          .filter((profile) => !recentConversationIds.has(profile.id))
          .slice(0, messagesConfig.limits.followingListSize)
      };
    },

    async getConversationHistory(
      context: MessagesContext,
      partnerId: string,
      cursor: MessageCursor | null
    ): Promise<MessageHistoryPage> {
      ensureOtherParticipant(context, partnerId);

      const partner = await repository.findProfileById(context, partnerId);

      if (!partner) {
        throw new AppError({
          statusCode: 404,
          code: "MESSAGE_PARTNER_NOT_FOUND",
          message: "Mesajlasilacak profil bulunamadi."
        });
      }

      const candidates = dedupeMessages(
        await repository.findConversationMessages(context, {
          partnerId,
          cursor,
          limit: messagesConfig.limits.historyQueryLimit
        })
      );
      const selected = candidates.slice(0, messagesConfig.limits.historyPageSize);
      const oldestSelected = selected[selected.length - 1];

      return {
        partner,
        // Listeyi ekranda dogal sohbet akisi icin eskiden yeniye ceviriyoruz.
        items: [...selected].reverse(),
        nextCursor:
          candidates.length > messagesConfig.limits.historyPageSize
            ? createCursor(oldestSelected)
            : null
      };
    },

    async sendMessage(context: MessagesContext, input: SendMessageInput) {
      ensureOtherParticipant(context, input.receiverId);

      const normalizedContent = normalizeMessageContent(input.content);

      if (normalizedContent.length === 0) {
        throw new AppError({
          statusCode: 400,
          code: "MESSAGE_CONTENT_REQUIRED",
          message: "Mesaj icerigi bos olamaz."
        });
      }

      if (normalizedContent.length > messagesConfig.limits.messageMaxLength) {
        throw new AppError({
          statusCode: 400,
          code: "MESSAGE_CONTENT_TOO_LONG",
          message: "Mesaj uzunlugu izin verilen limiti asti."
        });
      }

      const partner = await repository.findProfileById(context, input.receiverId);

      if (!partner) {
        throw new AppError({
          statusCode: 404,
          code: "MESSAGE_PARTNER_NOT_FOUND",
          message: "Mesajlasilacak profil bulunamadi."
        });
      }

      return repository.createMessage(context, {
        receiverId: partner.id,
        content: normalizedContent
      });
    },

    async markConversationAsRead(context: MessagesContext, partnerId: string) {
      ensureOtherParticipant(context, partnerId);

      const partner = await repository.findProfileById(context, partnerId);

      if (!partner) {
        throw new AppError({
          statusCode: 404,
          code: "MESSAGE_PARTNER_NOT_FOUND",
          message: "Mesajlasilacak profil bulunamadi."
        });
      }

      const updatedCount = await repository.markConversationAsRead(context, partnerId);

      return {
        partner,
        updatedCount
      };
    }
  };
}