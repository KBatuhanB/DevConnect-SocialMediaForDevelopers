import { z } from "zod";
import { authConfig } from "./config";
import type { LoginInput, RegisterInput } from "./types";

const usernamePattern = /^[a-z0-9_]+$/;

const registerSchema = z.object({
  email: z.string().trim().min(1).max(authConfig.validation.emailMaxLength).email().transform((value) => value.toLowerCase()),
  password: z.string().min(authConfig.validation.passwordMinLength).max(authConfig.validation.passwordMaxLength),
  username: z.string().trim().min(authConfig.validation.usernameMinLength).max(authConfig.validation.usernameMaxLength).regex(usernamePattern)
});

const loginSchema = z.object({
  email: z.string().trim().min(1).max(authConfig.validation.emailMaxLength).email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(authConfig.validation.passwordMaxLength)
});

export function parseRegisterBody(payload: unknown): RegisterInput {
  return registerSchema.parse(payload);
}

export function parseLoginBody(payload: unknown): LoginInput {
  return loginSchema.parse(payload);
}