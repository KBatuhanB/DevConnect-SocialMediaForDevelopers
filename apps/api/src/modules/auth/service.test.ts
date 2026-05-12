import { describe, expect, it } from "vitest";
import { createAuthService } from "./service";
import type { AuthGateway } from "./types";

describe("auth service", () => {
  it("kayit sonrasi session varsa cookie set edilebilir sonuc dondurur", async () => {
    const service = createAuthService({
      signUp: async () => ({
        user: {
          id: "user-1",
          email: "user@example.com",
          role: "authenticated"
        },
        session: {
          accessToken: "token-1",
          expiresIn: 3600
        },
        errorMessage: null
      }),
      signIn: async () => ({
        user: null,
        session: null,
        errorMessage: null
      }),
      getUser: async () => ({
        user: null,
        errorMessage: null
      })
    } satisfies AuthGateway);

    const result = await service.register({
      username: "user_1",
      email: "user@example.com",
      password: "12345678"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.requiresEmailVerification).toBe(false);
      expect(result.session?.accessToken).toBe("token-1");
    }
  });

  it("login hatasini sade hata mesajina cevirir", async () => {
    const service = createAuthService({
      signUp: async () => ({
        user: null,
        session: null,
        errorMessage: null
      }),
      signIn: async () => ({
        user: null,
        session: null,
        errorMessage: "invalid login"
      }),
      getUser: async () => ({
        user: null,
        errorMessage: null
      })
    } satisfies AuthGateway);

    const result = await service.login({
      email: "user@example.com",
      password: "wrong-password"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.status).toBe(401);
      expect(result.code).toBe("AUTH_LOGIN_FAILED");
    }
  });

  it("token dogrulama basarisizsa kullanici baglamini null dondurur", async () => {
    const service = createAuthService({
      signUp: async () => ({
        user: null,
        session: null,
        errorMessage: null
      }),
      signIn: async () => ({
        user: null,
        session: null,
        errorMessage: null
      }),
      getUser: async () => ({
        user: null,
        errorMessage: "expired"
      })
    } satisfies AuthGateway);

    await expect(service.getAuthenticatedUser("expired-token")).resolves.toBeNull();
  });
});