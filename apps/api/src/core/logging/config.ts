export const loggingConfig = {
  serviceName: "devconnect-api",
  developmentLevel: "debug",
  productionLevel: "info"
} as const;

export type LogLevel = "debug" | "info" | "warn" | "error";