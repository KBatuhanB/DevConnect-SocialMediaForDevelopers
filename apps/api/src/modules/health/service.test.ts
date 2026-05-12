import { describe, expect, it } from "vitest";
import { createHealthService } from "./service";

describe("health service", () => {
  it("status alanini ok olarak dondurur", () => {
    const service = createHealthService({
      read: () => ({
        status: "ok",
        service: "devconnect-api",
        version: "0.1.0",
        environment: "test",
        projectRef: "sqkwilincloarobypfbp",
        timestamp: "2026-05-09T00:00:00.000Z"
      })
    });

    expect(service.getStatus().status).toBe("ok");
  });
});