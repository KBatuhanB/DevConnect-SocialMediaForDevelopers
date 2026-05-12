import { z } from "zod";

type ApiEnv = {
  port: number;
  webOrigin: string;
  webOrigins: string[];
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  supabaseProjectRef: string;
  secureCookies: boolean;
};

const apiEnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_PROJECT_REF: z.string().min(1),
  COOKIE_SECURE: z.enum(["true", "false"]).optional()
});

const isTestEnvironment = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const testEnvFallbacks = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_PROJECT_REF: "test-project-ref"
};

const webOriginsSchema = z.array(z.string().url()).min(1);

function readWebOrigins(value: string) {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const parsedEnv = apiEnvSchema.safeParse({
  PORT: process.env.PORT,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
  // Testte import aninda fail etmek yerine sabit mock env ile modulleri yukleyebiliyoruz.
  SUPABASE_URL: process.env.SUPABASE_URL ?? (isTestEnvironment ? testEnvFallbacks.SUPABASE_URL : undefined),
  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY ?? (isTestEnvironment ? testEnvFallbacks.SUPABASE_ANON_KEY : undefined),
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    (isTestEnvironment ? testEnvFallbacks.SUPABASE_SERVICE_ROLE_KEY : undefined),
  SUPABASE_PROJECT_REF:
    process.env.SUPABASE_PROJECT_REF ??
    (isTestEnvironment ? testEnvFallbacks.SUPABASE_PROJECT_REF : undefined),
  COOKIE_SECURE: process.env.COOKIE_SECURE
});

if (!parsedEnv.success) {
  const invalidFields = parsedEnv.error.issues.map((issue) => issue.path.join(".")).join(", ");

  throw new Error(`API env gecersiz. Kontrol et: ${invalidFields}`);
}

const parsedWebOrigins = webOriginsSchema.safeParse(readWebOrigins(parsedEnv.data.WEB_ORIGIN));

if (!parsedWebOrigins.success) {
  throw new Error("WEB_ORIGIN gecersiz. Virgulle ayrilmis gecerli URL listesi bekleniyor.");
}

export const apiEnv: ApiEnv = {
  // Faz 5'te env eksigi varsa uygulama kontrollu sekilde en basta durur.
  port: parsedEnv.data.PORT,
  webOrigin: parsedWebOrigins.data[0],
  webOrigins: parsedWebOrigins.data,
  supabaseUrl: parsedEnv.data.SUPABASE_URL,
  supabaseAnonKey: parsedEnv.data.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: parsedEnv.data.SUPABASE_SERVICE_ROLE_KEY,
  supabaseProjectRef: parsedEnv.data.SUPABASE_PROJECT_REF,
  secureCookies:
    parsedEnv.data.COOKIE_SECURE === undefined
      ? process.env.NODE_ENV === "production"
      : parsedEnv.data.COOKIE_SECURE === "true"
};