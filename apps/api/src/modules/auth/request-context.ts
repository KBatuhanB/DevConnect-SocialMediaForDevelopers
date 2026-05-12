export type AuthenticatedUser = {
  id: string;
  email: string | null;
  role: string | null;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
    accessToken?: string;
  }
}

export {};