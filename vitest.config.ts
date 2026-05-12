import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "tests/e2e/**"
    ]
  }
});