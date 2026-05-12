import { Router, type RequestHandler } from "express";
import { healthConfig } from "./config";

export function createHealthRoutes(controller: RequestHandler) {
  const router = Router();

  router.get(healthConfig.routePath, controller);
  router.get(healthConfig.readyPath, controller);

  return router;
}