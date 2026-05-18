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

    await expect(page.getByRole("heading", { name: "Son konustuklarin" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Takip ettiklerin" })).toBeVisible();
    await expect(page.getByRole("button", { name: /peer_engineer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /design_ops/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "peer_engineer" })).toBeVisible();
    await expect(page.getByText("Supabase realtime ayarlari eksik oldugu icin canli iletim kapali.")).toBeVisible();

    await page.getByRole("button", { name: /design_ops/i }).click();
    await expect(page.getByRole("heading", { name: "design_ops" })).toBeVisible();

    await page.getByLabel("Mesaj icerigi").fill("Faz 12 mesaj testi");
    await page.getByRole("button", { name: "Gonder", exact: true }).click();

    await expect(page.getByText("Mesaj gonderilemedi")).toBeVisible();
    await expect(page.getByRole("button", { name: "Tekrar dene" })).toBeVisible();

    await page.getByRole("button", { name: "Tekrar dene" }).click();

    await expect(page.locator(".message-history").getByText("Faz 12 mesaj testi").last()).toBeVisible();
    await expect(page.getByText("Gonderildi")).toBeVisible();
    await expect(page.locator(".messages-sidebar-section").first().getByRole("button", { name: /design_ops/i })).toBeVisible();
  });

  test("mesajlardan ust bar ile profil ve iki feed akisina gecilir", async ({ page }) => {
    await page.goto(phase12TestConfig.e2e.routes.messages);

    await page.getByLabel("Profilim").click();
    await expect(page).toHaveURL(new RegExp(`${phase12TestConfig.e2e.routes.profile}$`));
    await expect(page.getByRole("heading", { name: "batuhan_dev" })).toBeVisible();

    await page.getByLabel("Takip ettiklerinin feed akisi").click();
    await expect(page).toHaveURL(new RegExp(`${phase12TestConfig.e2e.routes.dashboard}$`));
    await expect(page.getByRole("heading", { name: "Takip akisini kur" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Profile git" })).toHaveCount(0);

    await page.getByLabel("Ortak feed akisi").click();
    await expect(page).toHaveURL(/\/dashboard\/global$/);
    await expect(page.getByText("Node tarafinda sade repository desenini kullanmak isi hizlandirdi.")).toBeVisible();
  });
});