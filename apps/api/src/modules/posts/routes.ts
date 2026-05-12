import { Router, type RequestHandler } from "express";
import { postsConfig } from "./config";

type PostsController = {
  getPostsByProfileId: RequestHandler;
  createPost: RequestHandler;
  deleteMyPost: RequestHandler;
};

export function createPostsRoutes(controller: PostsController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(postsConfig.routes.byProfile, requireAuth, controller.getPostsByProfileId);
  router.post(postsConfig.routes.create, requireAuth, controller.createPost);
  router.delete(postsConfig.routes.detail, requireAuth, controller.deleteMyPost);

  return router;
}