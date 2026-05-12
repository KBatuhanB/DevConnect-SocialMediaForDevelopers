import type { AuthenticatedUser } from "./request-context";
import type { AuthActionResult, AuthGateway, LoginInput, RegisterInput } from "./types";

export type AuthService = ReturnType<typeof createAuthService>;

function buildAuthFailure(status: number, code: string, message: string): AuthActionResult {
  return {
    ok: false,
    status,
    code,
    message
  };
}

export function createAuthService(authGateway: AuthGateway) {
  return {
    async register(input: RegisterInput): Promise<AuthActionResult> {
      const result = await authGateway.signUp(input);

      if (result.errorMessage || !result.user) {
        return buildAuthFailure(400, "AUTH_REGISTER_FAILED", "Kayit su an tamamlanamadi.");
      }

      return {
        ok: true,
        status: 201,
        user: result.user,
        session: result.session,
        requiresEmailVerification: result.session === null
      };
    },
    async login(input: LoginInput): Promise<AuthActionResult> {
      const result = await authGateway.signIn(input);

      if (result.errorMessage || !result.user || !result.session) {
        return buildAuthFailure(401, "AUTH_LOGIN_FAILED", "E-posta veya sifre hatali.");
      }

      return {
        ok: true,
        status: 200,
        user: result.user,
        session: result.session,
        requiresEmailVerification: false
      };
    },
    async getAuthenticatedUser(accessToken: string): Promise<AuthenticatedUser | null> {
      const result = await authGateway.getUser(accessToken);

      if (result.errorMessage || !result.user) {
        return null;
      }

      return result.user;
    }
  };
}