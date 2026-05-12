import { apiEnv } from "../../config/env";

export const feedConfig = {
  routePath: "/api/feed",
  profileColumns: "id, username, avatar_path",
  postColumns:
    "id, user_id, content, media_path, code_language, post_type, created_at, author:profiles!inner(id, username, avatar_path)",
  pagination: {
    pageSize: 20,
    queryLimit: 21
  },
  storage: {
    postMediaPublicBaseUrl: `${apiEnv.supabaseUrl}/storage/v1/object/public/post-media`,
    avatarPublicBaseUrl: `${apiEnv.supabaseUrl}/storage/v1/object/public/avatars`
  }
} as const;