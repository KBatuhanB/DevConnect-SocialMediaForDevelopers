import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../apps/api/src/app";
import { phase12TestConfig } from "../config/phase-12.config";

describe("phase 12 api hardening", () => {
  it.each(phase12TestConfig.api.protectedRoutes)(
    "oturum olmadan $path icin 401 doner",
    async ({ method, path, body }) => {
      const app = createApp();
      let response = request(app)[method](path);

      if (body) {
        response = response.send(body);
      }

      await response.expect(401).expect(({ body: payload }) => {
        expect(payload).toMatchObject({
          success: false,
          error: {
            code: "AUTH_REQUIRED"
          }
        });
      });
    }
  );

  it("auth rate limit kontrollu olarak devreye girer", async () => {
    const app = createApp();

    for (let attempt = 1; attempt < phase12TestConfig.api.authRateLimitAttempts; attempt += 1) {
      await request(app)
        .post(phase12TestConfig.api.authRateLimitPath)
        // Supabase'a gitmeden once validation ve limit katmani test ediliyor.
        .send({
          email: "yanlis-format",
          password: "kisa"
        });
    }

    await request(app)
      .post(phase12TestConfig.api.authRateLimitPath)
      .send({
        email: "yanlis-format",
        password: "kisa"
      })
      .expect(429)
      .expect(({ body: payload }) => {
        expect(payload).toMatchObject({
          success: false,
          error: {
            code: "AUTH_RATE_LIMIT"
          }
        });
      });
  });
});