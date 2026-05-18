import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendSuccess } from "../../core/http/response";
import { mapValidationError } from "../../core/http/validation";
import type { MessageHistoryPage, MessagesSidebarData, MessageView } from "./types";
import { messageHistoryQuerySchema, messagePartnerParamsSchema, sendMessageSchema } from "./validation";

type MessagesService = {
  getConversations: (context: { accessToken: string; userId: string }) => Promise<MessagesSidebarData>;
  getConversationHistory: (
    context: { accessToken: string; userId: string },
    partnerId: string,
    cursor: { createdAt: string; id: string } | null
  ) => Promise<MessageHistoryPage>;
  sendMessage: (
    context: { accessToken: string; userId: string },
    input: { receiverId: string; content: string }
  ) => Promise<MessageView>;
  markConversationAsRead: (
    context: { accessToken: string; userId: string },
    partnerId: string
  ) => Promise<{ partner: MessageHistoryPage["partner"]; updatedCount: number }>;
};

function readRequestContext(request: Request) {
  if (!request.user || !request.accessToken) {
    throw new AppError({
      statusCode: 401,
      code: errorCodes.authRequired,
      message: "Bu islem icin giris yapmalisin."
    });
  }

  return {
    accessToken: request.accessToken,
    userId: request.user.id
  };
}

export function createMessagesController(service: MessagesService) {
  return {
    getRealtimeAuth: (request: Request, response: Response) => {
      const context = readRequestContext(request);

      sendSuccess(response, {
        // Realtime token sadece browser memory icin verilir; kalici depoya yazilmaz.
        auth: {
          accessToken: context.accessToken,
          userId: context.userId
        }
      });
    },

    getConversations: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const sidebarData = await service.getConversations(readRequestContext(request));

        sendSuccess(response, {
          conversations: sidebarData.conversations,
          followingProfiles: sidebarData.followingProfiles
        });
      } catch (error) {
        next(error);
      }
    },

    getConversationHistory: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = messagePartnerParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const parsedQuery = messageHistoryQuerySchema.safeParse(request.query);

        if (!parsedQuery.success) {
          next(mapValidationError(parsedQuery.error));
          return;
        }

        const cursor =
          parsedQuery.data.cursorCreatedAt && parsedQuery.data.cursorId
            ? {
                createdAt: parsedQuery.data.cursorCreatedAt,
                id: parsedQuery.data.cursorId
              }
            : null;
        const page = await service.getConversationHistory(
          readRequestContext(request),
          parsedParams.data.partnerId,
          cursor
        );

        sendSuccess(response, {
          page
        });
      } catch (error) {
        next(error);
      }
    },

    sendMessage: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedBody = sendMessageSchema.safeParse(request.body);

        if (!parsedBody.success) {
          next(mapValidationError(parsedBody.error));
          return;
        }

        const message = await service.sendMessage(readRequestContext(request), parsedBody.data);

        sendSuccess(
          response,
          {
            message
          },
          201
        );
      } catch (error) {
        next(error);
      }
    },

    markConversationAsRead: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = messagePartnerParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const result = await service.markConversationAsRead(readRequestContext(request), parsedParams.data.partnerId);

        sendSuccess(response, {
          result
        });
      } catch (error) {
        next(error);
      }
    }
  };
}