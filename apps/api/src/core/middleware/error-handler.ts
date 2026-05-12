import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { errorCodes } from "../errors/error-codes";
import { sendError } from "../http/response";
import { writeLog } from "../logging/logger";

function normalizeError(error: unknown) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError({
    statusCode: 500,
    code: errorCodes.internalError,
    message: "Beklenmeyen bir hata olustu.",
    details: error
  });
}

export function createErrorHandler() {
  return (error: unknown, request: Request, response: Response, next: NextFunction) => {
    void next;

    const appError = normalizeError(error);

    writeLog(appError.statusCode >= 500 ? "error" : "warn", "request.failed", {
      requestId: response.locals.requestId ?? "unknown",
      method: request.method,
      path: request.path,
      statusCode: appError.statusCode,
      errorCode: appError.code,
      userId: request.user?.id ?? null
    });

    sendError(response, appError);
  };
}