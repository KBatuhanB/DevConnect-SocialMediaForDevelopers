import { z } from "zod";
import { authFeatureConfig } from "./config";

const usernamePattern = /^[A-Za-z0-9_]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(authFeatureConfig.form.usernameMinLength)
    .max(authFeatureConfig.form.usernameMaxLength)
    .regex(usernamePattern),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(authFeatureConfig.form.passwordMinLength)
    .max(authFeatureConfig.form.passwordMaxLength)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(authFeatureConfig.form.passwordMaxLength)
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;