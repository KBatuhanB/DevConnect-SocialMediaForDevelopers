import { Router, type RequestHandler } from "express";
import { profilesConfig } from "./config";

type ProfilesController = {
  getMyProfile: RequestHandler;
  getProfileById: RequestHandler;
  updateMyProfile: RequestHandler;
  followProfile: RequestHandler;
  unfollowProfile: RequestHandler;
  uploadMyAvatar: RequestHandler;
};

export function createProfilesRoutes(controller: ProfilesController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(profilesConfig.routes.me, requireAuth, controller.getMyProfile);
  router.patch(profilesConfig.routes.me, requireAuth, controller.updateMyProfile);
  router.post(profilesConfig.routes.avatar, requireAuth, controller.uploadMyAvatar);
  router.get(profilesConfig.routes.detail, requireAuth, controller.getProfileById);
  router.post(profilesConfig.routes.follow, requireAuth, controller.followProfile);
  router.delete(profilesConfig.routes.follow, requireAuth, controller.unfollowProfile);

  return router;
}