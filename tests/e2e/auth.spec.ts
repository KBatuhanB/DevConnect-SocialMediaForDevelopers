import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { installMockDevConnectApi } from "./support/mock-devconnect-api";

test.describe("phase 12 auth smoke", () => {
  test("korumali rota auth ekranina yonlendirir", async ({ page }) => {
    await installMockDevConnectApi(page);

    await page.goto(phase12TestConfig.e2e.routes.dashboard);

    await expect(page).toHaveURL(/\/auth\?from=%2Fdashboard/);
    await expect(page.getByRole("heading", { name: "DevConnect kimlik merkezi" })).toBeVisible();
    await expect(page.getByText("Hedef:")).toContainText("/dashboard");
  });

  test("kayit formu dogrulama bilgisini gosterir", async ({ page }) => {
    await installMockDevConnectApi(page, {
      registerRequiresEmailVerification: true
    });

    await page.goto(phase12TestConfig.e2e.routes.auth);
    await page.getByLabel("Kullanici adi").fill("test_muhendis");
    await page.getByLabel("E-posta").fill("register@devconnect.test");
    await page.getByLabel("Sifre").fill("guvenliSifre123");
    await page.getByRole("button", { name: "Kaydi tamamla" }).click();

    await expect(page.getByText("Kayit olustu. Devam etmeden once e-posta dogrulamasini tamamla.")).toBeVisible();
    await expect(page.getByText("register@devconnect.test")).toBeVisible();
  });

  test("giris formu basarili olunca dashboarda gecis yapar", async ({ page }) => {
    await installMockDevConnectApi(page);

    await page.goto(phase12TestConfig.e2e.routes.auth);
    await page.locator("button", { hasText: "Giris yap" }).first().click();
    await page.getByLabel("E-posta").fill("viewer@devconnect.test");
    await page.getByLabel("Sifre").fill("guvenliSifre123");
    await page.locator("form").getByRole("button", { name: "Giris yap" }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Yeni paylasim" })).toBeVisible();
  });
});