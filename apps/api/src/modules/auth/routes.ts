import { Router, type RequestHandler } from "express";
import { authConfig } from "./config";

type AuthController = {
  register: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
  session: RequestHandler;
};

export function createAuthRoutes(
  controller: AuthController,
  authRateLimit: RequestHandler,
  requireAuth: RequestHandler
) {
  const router = Router();

  router.post(authConfig.registerPath, authRateLimit, controller.register);
  router.post(authConfig.loginPath, authRateLimit, controller.login);
  router.post(authConfig.logoutPath, controller.logout);
  router.get(authConfig.sessionPath, requireAuth, controller.session);

  return router;
}