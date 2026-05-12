import { createPublicSupabaseClient } from "../../core/supabase/client";
import type { AuthGateway, AuthGatewayResult, AuthUserLookupResult } from "./types";

const supabaseAuthClient = createPublicSupabaseClient();

function mapAuthResult(result: {
  user: { id: string; email?: string | null; role?: string | null } | null;
  session: { access_token: string; expires_in?: number | null } | null;
  error: { message: string } | null;
}): AuthGatewayResult {
  return {
    user: result.user
      ? {
          id: result.user.id,
          email: result.user.email ?? null,
          role: result.user.role ?? null
        }
      : null,
    session: result.session
      ? {
          accessToken: result.session.access_token,
          expiresIn: result.session.expires_in ?? 3600
        }
      : null,
    errorMessage: result.error?.message ?? null
  };
}

export function createSupabaseAuthGateway(): AuthGateway {
  return {
    async signUp(input) {
      const { data, error } = await supabaseAuthClient.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            username: input.username
          }
        }
      });

      return mapAuthResult({
        user: data.user,
        session: data.session,
        error
      });
    },
    async signIn(input) {
      const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
        email: input.email,
        password: input.password
      });

      return mapAuthResult({
        user: data.user,
        session: data.session,
        error
      });
    },
    async getUser(accessToken: string): Promise<AuthUserLookupResult> {
      const { data, error } = await supabaseAuthClient.auth.getUser(accessToken);

      return {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email ?? null,
              role: data.user.role ?? null
            }
          : null,
        errorMessage: error?.message ?? null
      };
    }
  };
}