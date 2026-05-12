import type { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { errorCodes } from "../errors/error-codes";

type ValidationErrorOptions = {
  code?: string;
  message?: string;
};

export function mapValidationError(error: ZodError, options: ValidationErrorOptions = {}) {
  return new AppError({
    statusCode: 400,
    code: options.code ?? errorCodes.validationFailed,
    message: options.message ?? "Gonderilen veri gecersiz.",
    details: error.flatten()
  });
}