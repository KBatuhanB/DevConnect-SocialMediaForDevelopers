import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { installMockDevConnectApi } from "./support/mock-devconnect-api";

test.describe("phase 12 auth smoke", () => {
  test("korumali rota auth ekranina yonlendirir", async ({ page }) => {
    await installMockDevConnectApi(page);

    await page.goto(phase12TestConfig.e2e.routes.dashboard);

    await expect(page).toHaveURL(/\/auth\?from=%2Fdashboard/);
    await expect(page.getByAltText("DevConnect logo")).toBeVisible();
    await expect(page.getByRole("button", { name: "Giris yap" }).first()).toBeVisible();
  });

  test("yonlendirme sorgusu giris sonrasi hedef rotaya geri doner", async ({ page }) => {
    await installMockDevConnectApi(page);

    await page.goto(phase12TestConfig.e2e.routes.profile);

    await expect(page).toHaveURL(/\/auth\?from=%2Fprofile/);

    await page.locator("button", { hasText: "Giris yap" }).first().click();
    await page.getByLabel("E-posta").fill("viewer@devconnect.test");
    await page.getByLabel("Sifre").fill("guvenliSifre123");
    await page.locator("form").getByRole("button", { name: "Giris yap" }).click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByLabel("Biyografi")).toBeVisible();
  });

  test("kayit formu dogrulama bilgisini gosterir", async ({ page }) => {
    await installMockDevConnectApi(page, {
      registerRequiresEmailVerification: true
    });

    await page.goto(phase12TestConfig.e2e.routes.auth);
    await page.locator("button", { hasText: "Kayit ol" }).first().click();
    await page.getByLabel("Kullanici adi").fill("test_muhendis");
    await page.getByLabel("E-posta").fill("register@devconnect.test");
    await page.getByLabel("Sifre").fill("guvenliSifre123");
    await page.getByRole("button", { name: "Kaydi tamamla" }).click();

    await expect(page.getByText("Kayit olustu. Devam etmeden once e-posta dogrulamasini tamamla.")).toBeVisible();
    await expect(page.getByLabel("E-posta")).toHaveValue("register@devconnect.test");
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