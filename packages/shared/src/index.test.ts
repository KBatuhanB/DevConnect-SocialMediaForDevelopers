import { describe, expect, it } from "vitest";
import { createAbsoluteUrl, sharedConfig } from "./index";

describe("shared package", () => {
  it("uygulama adini korur", () => {
    expect(sharedConfig.appName).toBe("DevConnect");
  });

  it("tam url uretir", () => {
    expect(createAbsoluteUrl("https://example.com", "/health")).toBe(
      "https://example.com/health"
    );
  });
});