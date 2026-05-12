import { AppError } from "../../core/errors/app-error";
import { createUserSupabaseClient } from "../../core/supabase/client";
import { viewerConfig } from "./config";
import type { ViewerContext, ViewerProfile } from "./types";

type ProfileRow = {
  id: string;
  username: string;
  bio: string;
  avatar_path: string | null;
  skills: string[] | null;
};

export function createViewerRepository() {
  return {
    async findMyProfile(context: ViewerContext): Promise<ViewerProfile | null> {
      const supabase = createUserSupabaseClient(context.accessToken);
      const { data, error } = await supabase
        .from("profiles")
        .select(viewerConfig.profileColumns)
        .eq("id", context.userId)
        .maybeSingle<ProfileRow>();

      if (error) {
        throw new AppError({
          statusCode: 500,
          code: "VIEWER_PROFILE_READ_FAILED",
          message: "Profil bilgisi su an okunamadi."
        });
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        username: data.username,
        bio: data.bio,
        avatarPath: data.avatar_path,
        skills: data.skills ?? []
      };
    }
  };
}