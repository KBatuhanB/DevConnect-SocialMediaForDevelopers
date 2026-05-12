import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { authenticateBrowserContext, installMockDevConnectApi } from "./support/mock-devconnect-api";

test.describe("phase 12 messages smoke", () => {
  test.beforeEach(async ({ context, page }) => {
    await installMockDevConnectApi(page, {
      disableRealtime: true,
      failFirstMessageSend: true
    });
    await authenticateBrowserContext(context);
  });

  test("dm akisi hata ve tekrar deneme ile korunur", async ({ page }) => {
    await page.goto(phase12TestConfig.e2e.routes.messages);

    await expect(page.getByRole("heading", { name: "peer_engineer" })).toBeVisible();
    await expect(page.getByText("Supabase realtime ayarlari eksik oldugu icin canli iletim kapali.")).toBeVisible();

    await page.getByPlaceholder("Mesajini yaz. Kisa, net ve teknik kal.").fill("Faz 12 mesaj testi");
    await page.getByRole("button", { name: "Gonder" }).click();

    await expect(page.getByText("Mesaj gonderilemedi")).toBeVisible();
    await expect(page.getByRole("button", { name: "Tekrar dene" })).toBeVisible();

    await page.getByRole("button", { name: "Tekrar dene" }).click();

    await expect(page.locator(".message-history").getByText("Faz 12 mesaj testi").last()).toBeVisible();
    await expect(page.getByText("Gonderildi")).toBeVisible();
  });
});