import { AppError } from "../../core/errors/app-error";
import { createServiceSupabaseClient, createUserSupabaseClient } from "../../core/supabase/client";
import { profilesConfig } from "../profiles/config";
import { postsConfig } from "./config";
import type { PostCommentView, PostView, PostsContext, PreparedCreatePostInput } from "./types";

type UserSupabaseClient = ReturnType<typeof createUserSupabaseClient>;

type PostRow = {
  id: string;
  user_id: string;
  content: string;
  media_path: string | null;
  code_language: string | null;
  post_type: "text" | "code" | "image";
  created_at: string;
};

type LikeRow = {
  post_id: string;
  user_id: string;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type CommentAuthorRow = {
  id: string;
  username: string;
  avatar_path: string | null;
};

function buildMediaUrl(mediaPath: string | null) {
  return mediaPath ? `${postsConfig.storage.publicBaseUrl}/${mediaPath}` : null;
}

function buildAvatarUrl(avatarPath: string | null) {
  return avatarPath ? `${profilesConfig.storage.avatarPublicBaseUrl}/${avatarPath}` : null;
}

function accumulateCounts(rows: Array<{ post_id: string }>) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
  }

  return counts;
}

async function readInteractionMaps(supabase: UserSupabaseClient, context: PostsContext, postIds: string[]) {
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
      code: "POST_LIKE_COUNT_READ_FAILED",
      message: "Begeni sayisi su an okunamadi."
    });
  }

  if (commentsResult.error) {
    throw new AppError({
      statusCode: 500,
      code: "POST_COMMENT_COUNT_READ_FAILED",
      message: "Yorum sayisi su an okunamadi."
    });
  }

  if (likedResult.error) {
    throw new AppError({
      statusCode: 500,
      code: "POST_LIKE_STATE_READ_FAILED",
      message: "Begeni durumu su an okunamadi."
    });
  }

  return {
    likeCounts: accumulateCounts(likesResult.data ?? []),
    commentCounts: accumulateCounts(commentsResult.data ?? []),
    likedPostIds: new Set((likedResult.data ?? []).map((row) => row.post_id))
  };
}

async function mapPostViews(supabase: UserSupabaseClient, context: PostsContext, rows: PostRow[]) {
  const postIds = rows.map((row) => row.id);
  const interactions = await readInteractionMaps(supabase, context, postIds);

  return rows.map((row) => mapPostView(row, context.userId, interactions));
}

function mapPostView(
  row: PostRow,
  userId: string,
  interactions: {
    likeCounts: Map<string, number>;
    commentCounts: Map<string, number>;
    likedPostIds: Set<string>;
  }
): PostView {
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
    stats: {
      likes: interactions.likeCounts.get(row.id) ?? 0,
      comments: interactions.commentCounts.get(row.id) ?? 0
    }
  };
}

async function readCommentAuthors(supabase: UserSupabaseClient, userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, CommentAuthorRow>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_path")
    .in("id", userIds)
    .returns<CommentAuthorRow[]>();

  if (error) {
    throw new AppError({
      statusCode: 500,
      code: "POST_COMMENT_AUTHOR_READ_FAILED",
      message: "Yorum sahipleri su an okunamadi."
    });
  }

  return new Map((data ?? []).map((row) => [row.id, row]));
}

async function mapCommentViews(supabase: UserSupabaseClient, context: PostsContext, rows: CommentRow[]): Promise<PostCommentView[]> {
  const authorMap = await readCommentAuthors(
    supabase,
    Array.from(new Set(rows.map((row) => row.user_id)))
  );

  return rows.map((row) => {
    const author = authorMap.get(row.user_id);

    if (!author) {
      throw new AppError({
        statusCode: 500,
        code: "POST_COMMENT_AUTHOR_READ_FAILED",
        message: "Yorum sahipleri su an okunamadi."
      });
    }

    return {
      id: row.id,
      postId: row.post_id,
      userId: row.user_id,
      content: row.content,
      createdAt: row.created_at,
      isOwner: row.user_id === context.userId,
      author: {
        id: author.id,
        username: author.username,
        avatarPath: author.avatar_path,
        avatarUrl: buildAvatarUrl(author.avatar_path)
      }
    };
  });
}

export function createPostsRepository() {
  return {
    async findPostsByProfileId(context: PostsContext, profileId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("posts")
        .select(postsConfig.postColumns)
        .eq("user_id", profileId)
        .order("created_at", { ascending: false })
        .returns<PostRow[]>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_LIST_READ_FAILED",
          message: "Paylasimlar su an okunamadi."
        });
      }

      return mapPostViews(supabase, context, data ?? []);
    },

    async findPostById(context: PostsContext, postId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("posts")
        .select(postsConfig.postColumns)
        .eq("id", postId)
        .maybeSingle<PostRow>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_READ_FAILED",
          message: "Paylasim su an okunamadi."
        });
      }

      if (!data) {
        return null;
      }

      const [post] = await mapPostViews(supabase, context, [data]);

      return post ?? null;
    },

    async findCommentsByPostId(context: PostsContext, postId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("comments")
        .select("id, post_id, user_id, content, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .returns<CommentRow[]>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_COMMENTS_READ_FAILED",
          message: "Yorumlar su an okunamadi."
        });
      }

      return mapCommentViews(supabase, context, data ?? []);
    },

    async createPost(context: PostsContext, input: PreparedCreatePostInput) {
      const userSupabase = createUserSupabaseClient(context.accessToken);
      const serviceSupabase = createServiceSupabaseClient();

      if (input.media) {
        const { error: uploadError } = await serviceSupabase.storage.from(postsConfig.storage.bucket).upload(input.media.mediaPath, input.media.fileBuffer, {
          contentType: input.media.contentType,
          upsert: false
        });

        if (uploadError) {
          throw new AppError({
            statusCode: 500,
            code: "POST_MEDIA_UPLOAD_FAILED",
            message: "Gorsel su an yuklenemedi."
          });
        }
      }

      const { data, error } = await userSupabase
        .from("posts")
        .insert({
          user_id: context.userId,
          content: input.content,
          media_path: input.media?.mediaPath ?? null,
          code_language: input.codeLanguage,
          post_type: input.postType
        })
        .select(postsConfig.postColumns)
        .maybeSingle<PostRow>();

      if (error) {
        if (input.media) {
          await serviceSupabase.storage.from(postsConfig.storage.bucket).remove([input.media.mediaPath]);
        }

        throw new AppError({
          statusCode: 500,
          code: "POST_CREATE_FAILED",
          message: "Paylasim su an olusturulamadi."
        });
      }

      if (!data) {
        return null;
      }

      const [post] = await mapPostViews(userSupabase, context, [data]);

      return post ?? null;
    },

    async createComment(context: PostsContext, postId: string, content: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: context.userId,
          content
        })
        .select("id, post_id, user_id, content, created_at")
        .maybeSingle<CommentRow>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_COMMENT_CREATE_FAILED",
          message: "Yorum su an gonderilemedi."
        });
      }

      if (!data) {
        return null;
      }

      const [comment] = await mapCommentViews(supabase, context, [data]);

      return comment ?? null;
    },

    async addLike(context: PostsContext, postId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { error } = await supabase.from("likes").insert({
        post_id: postId,
        user_id: context.userId
      });

      if (error && error.code !== "23505") {
        throw new AppError({
          statusCode: 500,
          code: "POST_LIKE_CREATE_FAILED",
          message: "Begeni su an kaydedilemedi."
        });
      }
    },

    async removeLike(context: PostsContext, postId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", context.userId);

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_LIKE_DELETE_FAILED",
          message: "Begeni su an kaldirilamadi."
        });
      }
    },

    async deletePost(context: PostsContext, post: PostView) {
      const userSupabase = createUserSupabaseClient(context.accessToken);
      const serviceSupabase = createServiceSupabaseClient();
      const { error } = await userSupabase.from("posts").delete().eq("id", post.id).eq("user_id", context.userId);

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "POST_DELETE_FAILED",
          message: "Paylasim su an silinemedi."
        });
      }

      if (post.mediaPath) {
        void serviceSupabase.storage.from(postsConfig.storage.bucket).remove([post.mediaPath]);
      }
    }
  };
}