import { createClient } from "@supabase/supabase-js";
import { apiEnv } from "../../config/env";

const baseSupabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
} as const;

export function createPublicSupabaseClient() {
  return createClient(apiEnv.supabaseUrl, apiEnv.supabaseAnonKey, baseSupabaseOptions);
}

export function createServiceSupabaseClient() {
  return createClient(apiEnv.supabaseUrl, apiEnv.supabaseServiceRoleKey, baseSupabaseOptions);
}

export function createUserSupabaseClient(accessToken: string) {
  return createClient(apiEnv.supabaseUrl, apiEnv.supabaseAnonKey, {
    ...baseSupabaseOptions,
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}