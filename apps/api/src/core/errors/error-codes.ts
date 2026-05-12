export const errorCodes = {
  internalError: "INTERNAL_ERROR",
  notFound: "NOT_FOUND",
  validationFailed: "VALIDATION_FAILED",
  authRequired: "AUTH_REQUIRED",
  authValidationFailed: "AUTH_VALIDATION_FAILED"
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];