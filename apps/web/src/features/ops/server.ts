import { opsFeatureConfig } from "./config";

export function readWebHealthPayload() {
  return {
    status: "ok" as const,
    service: opsFeatureConfig.health.serviceName,
    version: opsFeatureConfig.health.version,
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString()
  };
}