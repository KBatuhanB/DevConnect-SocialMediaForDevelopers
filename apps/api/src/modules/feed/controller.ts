import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendSuccess } from "../../core/http/response";
import { mapValidationError } from "../../core/http/validation";
import { feedQuerySchema } from "./validation";

type FeedService = {
  getFeedPage: (
    context: { accessToken: string; userId: string },
    cursor: { createdAt: string; id: string } | null,
    mode: "following" | "global"
  ) => Promise<unknown>;
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

export function createFeedController(service: FeedService) {
  return {
    getFeedPage: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedQuery = feedQuerySchema.safeParse(request.query);

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

        const page = await service.getFeedPage(readRequestContext(request), cursor, parsedQuery.data.mode);

        sendSuccess(response, {
          page
        });
      } catch (error) {
        next(error);
      }
    }
  };
}