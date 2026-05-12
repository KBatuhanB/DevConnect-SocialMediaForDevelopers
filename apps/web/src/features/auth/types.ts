export type AuthMode = "register" | "login";

export type AuthUser = {
  id: string;
  email: string | null;
  role: string | null;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResult = {
  ok: boolean;
  message: string;
  user: AuthUser | null;
  requiresEmailVerification: boolean;
};