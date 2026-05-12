import type { NextFunction, Request, Response } from "express";
import { writeLog } from "../logging/logger";
import { systemClock } from "../time/clock";

export function createRequestLoggerMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => {
    const startedAt = systemClock.nowMs();

    response.on("finish", () => {
      writeLog(response.statusCode >= 500 ? "error" : "info", "request.completed", {
        requestId: response.locals.requestId ?? "unknown",
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs: systemClock.nowMs() - startedAt,
        userId: request.user?.id ?? null
      });
    });

    next();
  };
}