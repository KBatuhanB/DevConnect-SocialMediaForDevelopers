import { apiEnv } from "../../config/env";
import { systemClock } from "../../core/time/clock";
import { healthConfig } from "./config";
import type { HealthPayload } from "./types";

export function createHealthRepository() {
  return {
    read(): HealthPayload {
      return {
        status: "ok",
        service: healthConfig.serviceName,
        version: "0.1.0",
        environment: process.env.NODE_ENV ?? "development",
        projectRef: apiEnv.supabaseProjectRef,
        timestamp: systemClock.nowIso()
      };
    }
  };
}