import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { authenticateBrowserContext, installMockDevConnectApi } from "./support/mock-devconnect-api";

test.describe("phase 12 social core smoke", () => {
  test.beforeEach(async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);
  });

  test("profil guncelleme, takip, post ve feed akisi korunur", async ({ page }) => {
    await page.goto(phase12TestConfig.e2e.routes.profile);

    await page.getByLabel("Biyografi").fill("Faz 12 icin test odakli bir profil notu.");
    await page.getByLabel("Beceri etiketleri").fill("TypeScript, Testing, Playwright");
    await page.getByRole("button", { name: "Profili kaydet" }).click();

    await expect(page.getByText("Profil bilgisi guncellendi.")).toBeVisible();
    await expect(page.getByText("Faz 12 icin test odakli bir profil notu.")).toBeVisible();

    await page.goto(phase12TestConfig.e2e.routes.peerProfile);
    await page.getByRole("button", { name: "Takip et" }).click();

    await expect(page.getByText("Takip durumu guncellendi.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Takipten cik" })).toBeVisible();

    await page.goto(phase12TestConfig.e2e.routes.dashboard);
    await expect(page.getByRole("heading", { name: "Takip feed'i" })).toBeVisible();
    await expect(page.getByText("Node tarafinda sade repository desenini kullanmak isi hizlandirdi.")).toBeVisible();

    await page.getByLabel("Icerik").fill("Faz 12 E2E icin yeni bir paylasim.");
    await page.getByRole("button", { name: "Paylasimi olustur" }).click();

    await expect(page.getByText("Paylasim olusturuldu.")).toBeVisible();
    await expect(page.getByText("Faz 12 E2E icin yeni bir paylasim.")).toBeVisible();
  });
});