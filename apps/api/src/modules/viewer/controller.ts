import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendSuccess } from "../../core/http/response";

type ViewerService = {
  getMyProfile: (context: { accessToken: string; userId: string }) => Promise<unknown>;
};

export function createViewerController(service: ViewerService) {
  return {
    getMyProfile: async (request: Request, response: Response, next: NextFunction) => {
      try {
        if (!request.user || !request.accessToken) {
          next(
            new AppError({
              statusCode: 401,
              code: errorCodes.authRequired,
              message: "Bu islem icin giris yapmalisin."
            })
          );
          return;
        }

        const profile = await service.getMyProfile({
          accessToken: request.accessToken,
          userId: request.user.id
        });

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    }
  };
}