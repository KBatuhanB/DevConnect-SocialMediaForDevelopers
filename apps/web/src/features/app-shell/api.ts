import { webEnv } from "@web/config/env";

export function buildHealthUrl(): string {
  return `${webEnv.apiBaseUrl}/health`;
}