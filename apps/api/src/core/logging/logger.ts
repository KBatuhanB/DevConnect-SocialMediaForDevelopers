import { loggingConfig, type LogLevel } from "./config";
import { systemClock } from "../time/clock";

type LogContext = Record<string, unknown>;

const logLevelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function readActiveLogLevel(): LogLevel {
  return process.env.NODE_ENV === "production"
    ? loggingConfig.productionLevel
    : loggingConfig.developmentLevel;
}

function shouldWriteLog(level: LogLevel) {
  return logLevelOrder[level] >= logLevelOrder[readActiveLogLevel()];
}

export function writeLog(level: LogLevel, message: string, context: LogContext = {}) {
  if (!shouldWriteLog(level)) {
    return;
  }

  const payload = JSON.stringify({
    level,
    message,
    service: loggingConfig.serviceName,
    timestamp: systemClock.nowIso(),
    ...context
  });

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.log(payload);
}