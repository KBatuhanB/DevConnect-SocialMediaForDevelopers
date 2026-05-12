import rateLimit from "express-rate-limit";
import { authConfig } from "./config";

export function createAuthRateLimit() {
  return rateLimit({
    windowMs: authConfig.rateLimit.windowMs,
    limit: authConfig.rateLimit.limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "AUTH_RATE_LIMIT",
        message: "Cok fazla deneme var. Biraz sonra tekrar dene."
      }
    }
  });
}