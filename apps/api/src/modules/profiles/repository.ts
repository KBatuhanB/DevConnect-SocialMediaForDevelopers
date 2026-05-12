import { AppError } from "../../core/errors/app-error";
import { createServiceSupabaseClient } from "../../core/supabase/client";
import { createUserSupabaseClient } from "../../core/supabase/client";
import { profilesConfig } from "./config";
import type { ProfileView, ProfilesContext, ReplaceAvatarInput, UpdateMyProfileInput } from "./types";

type UserSupabaseClient = ReturnType<typeof createUserSupabaseClient>;

type ProfileRow = {
  id: string;
  username: string;
  bio: string;
  avatar_path: string | null;
  skills: string[] | null;
};

function buildProfileReadError(code: string, message: string) {
  return new AppError({
    statusCode: 500,
    code,
    message
  });
}

function buildAvatarUrl(avatarPath: string | null) {
  return avatarPath ? `${profilesConfig.storage.avatarPublicBaseUrl}/${avatarPath}` : null;
}

async function readCount(
  supabase: UserSupabaseClient,
  table: "follows" | "posts",
  column: string,
  value: string,
  code: string,
  message: string
) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true }).eq(column, value);

  if (error) {
    throw buildProfileReadError(code, message);
  }

  return count ?? 0;
}

async function readFollowState(supabase: UserSupabaseClient, userId: string, profileId: string) {
  if (userId === profileId) {
    return false;
  }

  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", userId)
    .eq("following_id", profileId)
    .maybeSingle<{ follower_id: string }>();

  if (error) {
    throw buildProfileReadError("PROFILE_FOLLOW_STATE_READ_FAILED", "Takip durumu su an okunamadi.");
  }

  return data !== null;
}

async function mapProfileView(supabase: UserSupabaseClient, context: ProfilesContext, row: ProfileRow): Promise<ProfileView> {
  const [followers, following, posts, isFollowing] = await Promise.all([
    readCount(
      supabase,
      "follows",
      "following_id",
      row.id,
      "PROFILE_FOLLOWERS_COUNT_READ_FAILED",
      "Takipci sayisi su an okunamadi."
    ),
    readCount(
      supabase,
      "follows",
      "follower_id",
      row.id,
      "PROFILE_FOLLOWING_COUNT_READ_FAILED",
      "Takip edilen sayisi su an okunamadi."
    ),
    readCount(
      supabase,
      "posts",
      "user_id",
      row.id,
      "PROFILE_POST_COUNT_READ_FAILED",
      "Paylasim sayisi su an okunamadi."
    ),
    readFollowState(supabase, context.userId, row.id)
  ]);

  return {
    id: row.id,
    username: row.username,
    bio: row.bio,
    avatarPath: row.avatar_path,
    avatarUrl: buildAvatarUrl(row.avatar_path),
    skills: row.skills ?? [],
    stats: {
      followers,
      following,
      posts
    },
    isFollowing,
    isOwner: context.userId === row.id
  };
}

export function createProfilesRepository() {
  return {
    async findProfileById(context: ProfilesContext, profileId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("profiles")
        .select(profilesConfig.profileColumns)
        .eq("id", profileId)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw buildProfileReadError("PROFILE_READ_FAILED", "Profil bilgisi su an okunamadi.");
      }

      if (!data) {
        return null;
      }

      return mapProfileView(supabase, context, data);
    },

    async updateMyProfile(context: ProfilesContext, input: UpdateMyProfileInput) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("profiles")
        .update({
          bio: input.bio,
          skills: input.skills
        })
        .eq("id", context.userId)
        .select(profilesConfig.profileColumns)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "PROFILE_UPDATE_FAILED",
          message: "Profil bilgisi su an guncellenemedi."
        });
      }

      if (!data) {
        return null;
      }

      return mapProfileView(supabase, context, data);
    },

    async followProfile(context: ProfilesContext, profileId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { error } = await supabase.from("follows").insert({
        follower_id: context.userId,
        following_id: profileId
      });

      // Ayni takip iliskisini tekrar denemek veri katmaninda no-op sayilir.
      if (error && error.code !== "23505") {
        throw new AppError({
          statusCode: 500,
          code: "PROFILE_FOLLOW_FAILED",
          message: "Takip islemi su an tamamlanamadi."
        });
      }
    },

    async unfollowProfile(context: ProfilesContext, profileId: string) {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", context.userId)
        .eq("following_id", profileId);

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "PROFILE_UNFOLLOW_FAILED",
          message: "Takipten cikma islemi su an tamamlanamadi."
        });
      }
    },

    async replaceAvatar(context: ProfilesContext, input: ReplaceAvatarInput) {
      const serviceSupabase = createServiceSupabaseClient();
      const userSupabase = createUserSupabaseClient(context.accessToken);
      const { error: uploadError } = await serviceSupabase.storage
        .from(profilesConfig.storage.avatarBucket)
        .upload(input.nextAvatarPath, input.fileBuffer, {
          contentType: input.contentType,
          upsert: false
        });

      if (uploadError) {
        throw new AppError({
          statusCode: 500,
          code: "PROFILE_AVATAR_UPLOAD_FAILED",
          message: "Avatar su an yuklenemedi."
        });
      }

      const { data, error } = await userSupabase
        .from("profiles")
        .update({
          avatar_path: input.nextAvatarPath
        })
        .eq("id", context.userId)
        .select(profilesConfig.profileColumns)
        .maybeSingle<ProfileRow>();

      if (error) {
        await serviceSupabase.storage.from(profilesConfig.storage.avatarBucket).remove([input.nextAvatarPath]);

        throw new AppError({
          statusCode: 500,
          code: "PROFILE_AVATAR_SAVE_FAILED",
          message: "Avatar kaydi su an guncellenemedi."
        });
      }

      if (!data) {
        await serviceSupabase.storage.from(profilesConfig.storage.avatarBucket).remove([input.nextAvatarPath]);
        return null;
      }

      if (input.currentAvatarPath && input.currentAvatarPath !== input.nextAvatarPath) {
        void serviceSupabase.storage.from(profilesConfig.storage.avatarBucket).remove([input.currentAvatarPath]);
      }

      return mapProfileView(userSupabase, context, data);
    }
  };
}