import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendError } from "../../core/http/response";
import { clearAccessTokenCookie, readAccessTokenCookie } from "./cookies";
import type { AuthService } from "./service";

function sendAuthRequired(response: Response) {
  sendError(
    response,
    new AppError({
      statusCode: 401,
      code: errorCodes.authRequired,
      message: "Bu islem icin giris yapmalisin."
    })
  );
}

export function createRequireAuth(authService: AuthService) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const accessToken = readAccessTokenCookie(request);

      if (!accessToken) {
        sendAuthRequired(response);
        return;
      }

      const user = await authService.getAuthenticatedUser(accessToken);

      if (!user) {
        clearAccessTokenCookie(response);
        sendAuthRequired(response);
        return;
      }

      request.user = user;
      request.accessToken = accessToken;
      next();
    } catch (error) {
      next(error);
      return;
    }

    if (!request.user) {
      sendAuthRequired(response);
    }
  };
}