import { AppError } from "../../core/errors/app-error";
import type { ViewerContext, ViewerProfile } from "./types";

type ViewerRepository = {
  findMyProfile: (context: ViewerContext) => Promise<ViewerProfile | null>;
};

export function createViewerService(repository: ViewerRepository) {
  return {
    async getMyProfile(context: ViewerContext) {
      const profile = await repository.findMyProfile(context);

      if (!profile) {
        throw new AppError({
          statusCode: 404,
          code: "VIEWER_PROFILE_NOT_FOUND",
          message: "Profil kaydi bulunamadi."
        });
      }

      return profile;
    }
  };
}