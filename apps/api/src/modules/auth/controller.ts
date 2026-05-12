import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendError, sendSuccess } from "../../core/http/response";
import { mapValidationError } from "../../core/http/validation";
import { clearAccessTokenCookie, setAccessTokenCookie } from "./cookies";
import type { AuthService } from "./service";
import { parseLoginBody, parseRegisterBody } from "./validation";

export function createAuthController(authService: AuthService) {
  return {
    register: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const input = parseRegisterBody(request.body);
        const result = await authService.register(input);

        if (!result.ok) {
          sendError(
            response,
            new AppError({
              statusCode: result.status,
              code: result.code,
              message: result.message
            })
          );
          return;
        }

        if (result.session) {
          // Token sadece HTTPOnly cookie'ye yazilir; istemci JS bunu okuyamaz.
          setAccessTokenCookie(response, result.session.accessToken, result.session.expiresIn);
        }

        sendSuccess(
          response,
          {
            user: result.user,
            requiresEmailVerification: result.requiresEmailVerification
          },
          result.status
        );
      } catch (error) {
        if (error instanceof ZodError) {
          sendError(
            response,
            mapValidationError(error, {
              code: errorCodes.authValidationFailed,
              message: "Gonderilen auth bilgileri gecersiz."
            })
          );
          return;
        }

        next(error);
      }
    },
    login: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const input = parseLoginBody(request.body);
        const result = await authService.login(input);

        if (!result.ok) {
          sendError(
            response,
            new AppError({
              statusCode: result.status,
              code: result.code,
              message: result.message
            })
          );
          return;
        }

        if (result.session) {
          setAccessTokenCookie(response, result.session.accessToken, result.session.expiresIn);
        }

        sendSuccess(
          response,
          {
            user: result.user,
            requiresEmailVerification: false
          },
          result.status
        );
      } catch (error) {
        if (error instanceof ZodError) {
          sendError(
            response,
            mapValidationError(error, {
              code: errorCodes.authValidationFailed,
              message: "Gonderilen auth bilgileri gecersiz."
            })
          );
          return;
        }

        next(error);
      }
    },
    logout: (_request: Request, response: Response) => {
      clearAccessTokenCookie(response);

      sendSuccess(response, {
        message: "Oturum kapatildi."
      });
    },
    session: (request: Request, response: Response) => {
      sendSuccess(response, {
        user: request.user ?? null
      });
    }
  };
}