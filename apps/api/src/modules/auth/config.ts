import { apiEnv } from "../../config/env";

export const authConfig = {
  registerPath: "/auth/register",
  loginPath: "/auth/login",
  logoutPath: "/auth/logout",
  sessionPath: "/api/session",
  cors: {
    origins: apiEnv.webOrigins,
    credentials: true
  },
  rateLimit: {
    windowMs: 10 * 60 * 1000,
    limit: 10
  },
  validation: {
    emailMaxLength: 120,
    usernameMinLength: 3,
    usernameMaxLength: 50,
    passwordMinLength: 8,
    passwordMaxLength: 72
  },
  cookies: {
    accessTokenName: "devconnect-access-token",
    path: "/",
    sameSite: "lax" as const,
    secure: apiEnv.secureCookies
  }
} as const;