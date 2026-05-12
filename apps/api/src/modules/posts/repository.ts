import { AppError } from "../../core/errors/app-error";
import { createServiceSupabaseClient, createUserSupabaseClient } from "../../core/supabase/client";
import { postsConfig } from "./config";
import type { PostView, PostsContext, PreparedCreatePostInput } from "./types";

type PostRow = {
  id: string;
  user_id: string;
  content: string;
  media_path: string | null;
  code_language: string | null;
  post_type: "text" | "code" | "image";
  created_at: string;
};

function buildMediaUrl(mediaPath: string | null) {
  return mediaPath ? `${postsConfig.storage.publicBaseUrl}/${mediaPath}` : null;
}

function mapPostView(row: PostRow, userId: string): PostView {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    mediaPath: row.media_path,
    mediaUrl: buildMediaUrl(row.media_path),
    codeLanguage: row.code_language,
    postType: row.post_type,
    createdAt: row.created_at,
    isOwner: row.user_id === userId
  };
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

      return (data ?? []).map((row) => mapPostView(row, context.userId));
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

      return data ? mapPostView(data, context.userId) : null;
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

      return data ? mapPostView(data, context.userId) : null;
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