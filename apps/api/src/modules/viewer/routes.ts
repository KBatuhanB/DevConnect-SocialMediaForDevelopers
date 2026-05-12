import { Router, type RequestHandler } from "express";
import { viewerConfig } from "./config";

type ViewerController = {
  getMyProfile: RequestHandler;
};

export function createViewerRoutes(controller: ViewerController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(viewerConfig.routePath, requireAuth, controller.getMyProfile);

  return router;
}