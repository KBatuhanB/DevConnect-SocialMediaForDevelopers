import type { Request, Response } from "express";
import { authConfig } from "./config";

function buildCookieOptions(maxAge: number | undefined) {
  return {
    httpOnly: true,
    sameSite: authConfig.cookies.sameSite,
    secure: authConfig.cookies.secure,
    path: authConfig.cookies.path,
    ...(maxAge === undefined ? {} : { maxAge })
  };
}

export function readAccessTokenCookie(request: Request) {
  return request.cookies?.[authConfig.cookies.accessTokenName] as string | undefined;
}

export function setAccessTokenCookie(response: Response, accessToken: string, expiresIn: number) {
  response.cookie(
    authConfig.cookies.accessTokenName,
    accessToken,
    buildCookieOptions(Math.max(expiresIn * 1000, 60_000))
  );
}

export function clearAccessTokenCookie(response: Response) {
  response.clearCookie(authConfig.cookies.accessTokenName, buildCookieOptions(undefined));
}