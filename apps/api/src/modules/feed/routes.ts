import { Router, type RequestHandler } from "express";
import { feedConfig } from "./config";

type FeedController = {
  getFeedPage: RequestHandler;
};

export function createFeedRoutes(controller: FeedController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(feedConfig.routePath, requireAuth, controller.getFeedPage);

  return router;
}