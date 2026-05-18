import { ApiClientError, apiRequest, readApiErrorMessage } from "@web/lib/api-client";
import { authFeatureConfig } from "./config";
import type { AuthResult, AuthUser, LoginInput, RegisterInput } from "./types";

type AuthPayload = {
  user?: AuthUser | null;
  requiresEmailVerification?: boolean;
  message?: string;
};

function mapAuthSuccess(payload: AuthPayload, successMessage: string): AuthResult {
  return {
    ok: true,
    message: payload.message ?? successMessage,
    user: payload.user ?? null,
    requiresEmailVerification: payload.requiresEmailVerification ?? false
  };
}

function mapAuthFailure(error: unknown): AuthResult {
  if (error instanceof ApiClientError) {
    return {
      ok: false,
      message: error.message,
      user: null,
      requiresEmailVerification: false
    };
  }

  return {
    ok: false,
    message: readApiErrorMessage(error),
    user: null,
    requiresEmailVerification: false
  };
}

export async function registerWithPassword(input: RegisterInput) {
  try {
    const payload = await apiRequest<AuthPayload>(authFeatureConfig.api.registerPath, {
      method: "POST",
      body: JSON.stringify(input)
    });

    return mapAuthSuccess(payload, "Kayıt tamamlandı.");
  } catch (error) {
    return mapAuthFailure(error);
  }
}

export async function loginWithPassword(input: LoginInput) {
  try {
    const payload = await apiRequest<AuthPayload>(authFeatureConfig.api.loginPath, {
      method: "POST",
      body: JSON.stringify(input)
    });

    return mapAuthSuccess(payload, "Giriş başarılı.");
  } catch (error) {
    return mapAuthFailure(error);
  }
}

export async function logoutFromSession() {
  try {
    const payload = await apiRequest<AuthPayload>(authFeatureConfig.api.logoutPath, {
      method: "POST"
    });

    return mapAuthSuccess(payload, "Oturum kapatildi.");
  } catch (error) {
    return mapAuthFailure(error);
  }
}

export async function getCurrentSession() {
  try {
    const payload = await apiRequest<{ user?: AuthUser | null }>(authFeatureConfig.api.sessionPath, {
      method: "GET"
    });

    return payload.user ?? null;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }

    throw error;
  }
}