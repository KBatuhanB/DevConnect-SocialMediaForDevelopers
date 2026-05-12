import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createErrorHandler } from "./core/middleware/error-handler";
import { createNotFoundHandler } from "./core/middleware/not-found";
import { createRequestIdMiddleware } from "./core/middleware/request-id";
import { createRequestLoggerMiddleware } from "./core/middleware/request-logger";
import { authConfig } from "./modules/auth/config";
import { profilesConfig } from "./modules/profiles/config";
import "./modules/auth/request-context";
import { registerModuleRoutes } from "./routes/register-module-routes";

export function createApp() {
  const app = express();
  const allowedOrigins = new Set(authConfig.cors.origins);

  app.use(
    cors({
      origin(origin, callback) {
        // Faz 13'te preview ve production domain listesi env'den kontrollu okunur.
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: authConfig.cors.credentials
    })
  );
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json({ limit: profilesConfig.limits.requestBodyLimit }));
  app.use(createRequestIdMiddleware());
  app.use(createRequestLoggerMiddleware());

  void authConfig;
  registerModuleRoutes(app);

  app.use(createNotFoundHandler());
  app.use(createErrorHandler());

  return app;
}