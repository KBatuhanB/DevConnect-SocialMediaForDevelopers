import { AppError } from "../../core/errors/app-error";
import { createUserSupabaseClient } from "../../core/supabase/client";
import { feedConfig } from "./config";
import type { FeedContext, FeedCursor, FeedItemView } from "./types";

type FeedRow = {
  id: string;
  user_id: string;
  content: string;
  media_path: string | null;
  code_language: string | null;
  post_type: "text" | "code" | "image";
  created_at: string;
  author:
    | {
        id: string;
        username: string;
        avatar_path: string | null;
      }
    | Array<{
        id: string;
        username: string;
        avatar_path: string | null;
      }>;
};

function buildAvatarUrl(avatarPath: string | null) {
  return avatarPath ? `${feedConfig.storage.avatarPublicBaseUrl}/${avatarPath}` : null;
}

function buildMediaUrl(mediaPath: string | null) {
  return mediaPath ? `${feedConfig.storage.postMediaPublicBaseUrl}/${mediaPath}` : null;
}

function readAuthorRow(author: FeedRow["author"]) {
  return Array.isArray(author) ? author[0] : author;
}

function mapFeedItem(row: FeedRow, userId: string): FeedItemView {
  const author = readAuthorRow(row.author);

  if (!author) {
    throw new AppError({
      statusCode: 500,
      code: "FEED_AUTHOR_READ_FAILED",
      message: "Feed sahibi bilgisi su an okunamadi."
    });
  }

  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    mediaPath: row.media_path,
    mediaUrl: buildMediaUrl(row.media_path),
    codeLanguage: row.code_language,
    postType: row.post_type,
    createdAt: row.created_at,
    isOwner: row.user_id === userId,
    author: {
      id: author.id,
      username: author.username,
      avatarPath: author.avatar_path,
      avatarUrl: buildAvatarUrl(author.avatar_path)
    },
    // Faz 9'da kart formatini sabitliyoruz; gercek etkileşim sayilari Faz 10'da gelecek.
    stats: {
      likes: 0,
      comments: 0
    }
  };
}

export function createFeedRepository() {
  return {
    async findFollowingIds(context: FeedContext) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", context.userId)
        .returns<Array<{ following_id: string }>>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "FEED_FOLLOWS_READ_FAILED",
          message: "Takip listesi su an okunamadi."
        });
      }

      return (data ?? []).map((row) => row.following_id);
    },

    async findFeedCandidates(context: FeedContext, input: { allowedUserIds: string[]; cursor: FeedCursor | null; limit: number }) {
      const supabase = createUserSupabaseClient(context.accessToken);
      let query = supabase
        .from("posts")
        .select(feedConfig.postColumns)
        .in("user_id", input.allowedUserIds)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(input.limit);

      if (input.cursor) {
        query = query.or(`created_at.lt.${input.cursor.createdAt},and(created_at.eq.${input.cursor.createdAt},id.lt.${input.cursor.id})`);
      }

      const { data, error } = await query.returns<FeedRow[]>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "FEED_READ_FAILED",
          message: "Feed verisi su an okunamadi."
        });
      }

      return (data ?? []).map((row) => mapFeedItem(row, context.userId));
    }
  };
}