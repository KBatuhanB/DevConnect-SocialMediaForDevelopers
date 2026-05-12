import type { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { errorCodes } from "../errors/error-codes";
import { sendError } from "../http/response";

export function createNotFoundHandler() {
  return (_request: Request, response: Response) => {
    sendError(
      response,
      new AppError({
        statusCode: 404,
        code: errorCodes.notFound,
        message: "Istenen endpoint bulunamadi."
      })
    );
  };
}