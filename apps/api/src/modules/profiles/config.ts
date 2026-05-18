import { apiEnv } from "../../config/env";

export const profilesConfig = {
  routes: {
    me: "/api/profiles/me",
    search: "/api/profiles/search",
    detail: "/api/profiles/:profileId",
    follow: "/api/profiles/:profileId/follow",
    avatar: "/api/profiles/me/avatar"
  },
  profileColumns: "id, username, bio, avatar_path, skills",
  limits: {
    bioMaxLength: 300,
    skillMaxCount: 10,
    skillMaxLength: 24,
    searchQueryMaxLength: 50,
    searchResultLimit: 6,
    avatarMaxBytes: 2_097_152,
    requestBodyLimit: "4mb"
  },
  storage: {
    avatarBucket: "avatars",
    avatarPublicBaseUrl: `${apiEnv.supabaseUrl}/storage/v1/object/public/avatars`,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] as const
  }
} as const;