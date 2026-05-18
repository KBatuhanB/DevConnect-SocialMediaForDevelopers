import { apiEnv } from "../../config/env";

export const postsConfig = {
  routes: {
    create: "/api/posts",
    detail: "/api/posts/:postId",
    byProfile: "/api/profiles/:profileId/posts",
    likes: "/api/posts/:postId/likes",
    comments: "/api/posts/:postId/comments"
  },
  postColumns: "id, user_id, content, media_path, code_language, post_type, created_at",
  limits: {
    contentMaxLength: 5000,
    mediaMaxBytes: 2_097_152,
    commentMaxLength: 1000
  },
  content: {
    supportedCodeLanguages: ["typescript", "javascript", "tsx", "jsx", "python", "sql", "json", "bash"] as const
  },
  storage: {
    bucket: "post-media",
    publicBaseUrl: `${apiEnv.supabaseUrl}/storage/v1/object/public/post-media`,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] as const
  }
} as const;