import { describe, expect, it } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { authConfig } from "./config";
import { createRequireAuth } from "./middleware";
import type { AuthService } from "./service";

type MockResponse = Response & {
  statusCodeValue?: number;
  jsonBody?: unknown;
  clearedCookieName?: string;
};

function createMockResponse(): MockResponse {
  const response = {
    locals: {
      requestId: "test-request"
    },
    status(code: number) {
      response.statusCodeValue = code;
      return response;
    },
    json(payload: unknown) {
      response.jsonBody = payload;
      return response;
    },
    clearCookie(name: string) {
      response.clearedCookieName = name;
      return response;
    }
  } as unknown as MockResponse;

  return response;
}

describe("auth middleware", () => {
  it("cookie yoksa 401 dondurur", async () => {
    const middleware = createRequireAuth({
      register: async () => ({
        ok: false,
        status: 400,
        code: "AUTH_REGISTER_FAILED",
        message: "Kayit su an tamamlanamadi."
      }),
      login: async () => ({
        ok: false,
        status: 401,
        code: "AUTH_LOGIN_FAILED",
        message: "E-posta veya sifre hatali."
      }),
      getAuthenticatedUser: async () => null
    } as AuthService);

    const request = {
      cookies: {}
    } as unknown as Request;
    const response = createMockResponse();
    let nextCalled = false;

    await middleware(request, response, (() => {
      nextCalled = true;
    }) as NextFunction);

    expect(nextCalled).toBe(false);
    expect(response.statusCodeValue).toBe(401);
  });

  it("gelen token dogruysa user baglamini request ustune yazar", async () => {
    const middleware = createRequireAuth({
      register: async () => ({
        ok: false,
        status: 400,
        code: "AUTH_REGISTER_FAILED",
        message: "Kayit su an tamamlanamadi."
      }),
      login: async () => ({
        ok: false,
        status: 401,
        code: "AUTH_LOGIN_FAILED",
        message: "E-posta veya sifre hatali."
      }),
      getAuthenticatedUser: async () => ({
        id: "user-1",
        email: "user@example.com",
        role: "authenticated"
      })
    } as AuthService);

    const request = {
      cookies: {
        [authConfig.cookies.accessTokenName]: "token-1"
      }
    } as unknown as Request;
    const response = createMockResponse();
    let nextCalled = false;

    await middleware(request, response, (() => {
      nextCalled = true;
    }) as NextFunction);

    expect(nextCalled).toBe(true);
    expect(request.user?.email).toBe("user@example.com");
  });
});