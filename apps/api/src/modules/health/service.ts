import type { HealthPayload } from "./types";

type HealthRepository = {
  read: () => HealthPayload;
};

export function createHealthService(repository: HealthRepository) {
  return {
    getStatus(): HealthPayload {
      return repository.read();
    }
  };
}