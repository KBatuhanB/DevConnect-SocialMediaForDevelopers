import { createClient } from "@supabase/supabase-js";
import { webEnv } from "@web/config/env";

const browserSupabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
} as const;

export function createRealtimeSupabaseClient(accessToken: string) {
  const client = createClient(webEnv.supabaseUrl, webEnv.supabaseAnonKey, browserSupabaseOptions);

  client.realtime.setAuth(accessToken);

  return client;
}