import type { AuthenticatedUser } from "./request-context";

export type RegisterInput = {
  email: string;
  password: string;
  username: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthSession = {
  accessToken: string;
  expiresIn: number;
};

export type AuthGatewayResult = {
  user: AuthenticatedUser | null;
  session: AuthSession | null;
  errorMessage: string | null;
};

export type AuthUserLookupResult = {
  user: AuthenticatedUser | null;
  errorMessage: string | null;
};

export type AuthGateway = {
  signUp: (input: RegisterInput) => Promise<AuthGatewayResult>;
  signIn: (input: LoginInput) => Promise<AuthGatewayResult>;
  getUser: (accessToken: string) => Promise<AuthUserLookupResult>;
};

export type AuthActionResult =
  | {
      ok: true;
      status: number;
      user: AuthenticatedUser;
      session: AuthSession | null;
      requiresEmailVerification: boolean;
    }
  | {
      ok: false;
      status: number;
      code: string;
      message: string;
    };