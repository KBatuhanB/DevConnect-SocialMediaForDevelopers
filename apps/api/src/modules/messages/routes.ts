import { Router, type RequestHandler } from "express";
import { messagesConfig } from "./config";

type MessagesController = {
  getRealtimeAuth: RequestHandler;
  getConversations: RequestHandler;
  getConversationHistory: RequestHandler;
  sendMessage: RequestHandler;
  markConversationAsRead: RequestHandler;
};

export function createMessagesRoutes(controller: MessagesController, requireAuth: RequestHandler) {
  const router = Router();

  router.get(messagesConfig.realtimeAuthPath, requireAuth, controller.getRealtimeAuth);
  router.get(messagesConfig.routePath, requireAuth, controller.getConversations);
  router.get(`${messagesConfig.routePath}/conversations/:partnerId`, requireAuth, controller.getConversationHistory);
  router.post(messagesConfig.routePath, requireAuth, controller.sendMessage);
  router.post(`${messagesConfig.routePath}/conversations/:partnerId/read`, requireAuth, controller.markConversationAsRead);

  return router;
}