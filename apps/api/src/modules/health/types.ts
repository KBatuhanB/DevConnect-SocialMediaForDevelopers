export type HealthPayload = {
  status: "ok";
  service: string;
  version: string;
  environment: string;
  projectRef: string;
  timestamp: string;
};