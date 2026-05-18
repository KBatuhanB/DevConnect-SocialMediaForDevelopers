import { Router, type RequestHandler } from "express";
import { postsConfig } from "./config";

type PostsController = {
  getPostsByProfileId: RequestHandler;
  getCommentsByPostId: RequestHandler;
  createPost: RequestHandler;
  createComment: RequestHandler;
  likePost: RequestHandler;
  unlikePost: RequestHandler;
  deleteMyPost: RequestHandler;
};

export function createPostsRoutes(controller: PostsController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(postsConfig.routes.byProfile, requireAuth, controller.getPostsByProfileId);
  router.get(postsConfig.routes.comments, requireAuth, controller.getCommentsByPostId);
  router.post(postsConfig.routes.create, requireAuth, controller.createPost);
  router.post(postsConfig.routes.comments, requireAuth, controller.createComment);
  router.post(postsConfig.routes.likes, requireAuth, controller.likePost);
  router.delete(postsConfig.routes.likes, requireAuth, controller.unlikePost);
  router.delete(postsConfig.routes.detail, requireAuth, controller.deleteMyPost);

  return router;
}