import type { Response } from "express";
import type { AppError } from "../errors/app-error";

function readRequestId(response: Response) {
  return response.locals.requestId ?? "unknown";
}

export function sendSuccess<T>(response: Response, data: T, statusCode = 200) {
  response.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: readRequestId(response)
    }
  });
}

export function sendError(response: Response, error: AppError) {
  response.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      requestId: readRequestId(response)
    }
  });
}