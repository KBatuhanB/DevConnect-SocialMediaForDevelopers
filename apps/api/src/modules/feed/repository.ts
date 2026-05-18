import { AppError } from "../../core/errors/app-error";
import { createUserSupabaseClient } from "../../core/supabase/client";
import { feedConfig } from "./config";
import type { FeedContext, FeedCursor, FeedItemView } from "./types";

type UserSupabaseClient = ReturnType<typeof createUserSupabaseClient>;

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

type LikeRow = {
  post_id: string;
  user_id: string;
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

function accumulateCounts(rows: Array<{ post_id: string }>) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
  }

  return counts;
}

async function readInteractionMaps(supabase: UserSupabaseClient, context: FeedContext, postIds: string[]) {
  if (postIds.length === 0) {
    return {
      likeCounts: new Map<string, number>(),
      commentCounts: new Map<string, number>(),
      likedPostIds: new Set<string>()
    };
  }

  const [likesResult, commentsResult, likedResult] = await Promise.all([
    supabase.from("likes").select("post_id").in("post_id", postIds).returns<Array<{ post_id: string }>>(),
    supabase.from("comments").select("post_id").in("post_id", postIds).returns<Array<{ post_id: string }>>(),
    supabase
      .from("likes")
      .select("post_id, user_id")
      .eq("user_id", context.userId)
      .in("post_id", postIds)
      .returns<LikeRow[]>()
  ]);

  if (likesResult.error) {
    throw new AppError({
      statusCode: 500,
      code: "FEED_LIKE_COUNT_READ_FAILED",
      message: "Feed begeni bilgisi su an okunamadi."
    });
  }

  if (commentsResult.error) {
    throw new AppError({
      statusCode: 500,
      code: "FEED_COMMENT_COUNT_READ_FAILED",
      message: "Feed yorum bilgisi su an okunamadi."
    });
  }

  if (likedResult.error) {
    throw new AppError({
      statusCode: 500,
      code: "FEED_LIKE_STATE_READ_FAILED",
      message: "Feed begeni durumu su an okunamadi."
    });
  }

  return {
    likeCounts: accumulateCounts(likesResult.data ?? []),
    commentCounts: accumulateCounts(commentsResult.data ?? []),
    likedPostIds: new Set((likedResult.data ?? []).map((row) => row.post_id))
  };
}

function mapFeedItem(
  row: FeedRow,
  userId: string,
  interactions: {
    likeCounts: Map<string, number>;
    commentCounts: Map<string, number>;
    likedPostIds: Set<string>;
  }
): FeedItemView {
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
    isLiked: interactions.likedPostIds.has(row.id),
    author: {
      id: author.id,
      username: author.username,
      avatarPath: author.avatar_path,
      avatarUrl: buildAvatarUrl(author.avatar_path)
    },
    stats: {
      likes: interactions.likeCounts.get(row.id) ?? 0,
      comments: interactions.commentCounts.get(row.id) ?? 0
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

    async findFeedCandidates(context: FeedContext, input: { allowedUserIds?: string[]; cursor: FeedCursor | null; limit: number }) {
      const supabase = createUserSupabaseClient(context.accessToken);
      let query = supabase
        .from("posts")
        .select(feedConfig.postColumns)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(input.limit);

      if (input.allowedUserIds) {
        query = query.in("user_id", input.allowedUserIds);
      }

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

      const rows = data ?? [];
      const interactions = await readInteractionMaps(
        supabase,
        context,
        rows.map((row) => row.id)
      );

      return rows.map((row) => mapFeedItem(row, context.userId, interactions));
    }
  };
}