import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { authenticateBrowserContext, installMockDevConnectApi } from "./support/mock-devconnect-api";

test.describe("phase 12 social core smoke", () => {
  test.beforeEach(async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);
  });

  test("profil guncelleme, takip ve feed akisi korunur", async ({ page }) => {
    await page.goto(phase12TestConfig.e2e.routes.profile);

    await page.getByLabel("Profil ayarlari").click();
    await page.getByRole("button", { name: "Hakkimda bilgisini duzenle" }).click();
    const bioDialog = page.locator("dialog[open]");
    await expect(bioDialog.getByRole("heading", { name: "Hakkimda bilgisini duzenle" })).toBeVisible();
    await bioDialog.getByLabel("Hakkimda").fill("Faz 12 icin test odakli bir profil notu.");
    await bioDialog.getByRole("button", { name: "Kaydet" }).click();

    await page.getByLabel("Profil ayarlari").click();
    await page.getByRole("button", { name: "Beceri etiketlerini duzenle" }).click();
    const skillsDialog = page.locator("dialog[open]");
    await expect(skillsDialog.getByRole("heading", { name: "Beceri etiketlerini duzenle" })).toBeVisible();
    await skillsDialog.getByLabel("Beceri etiketleri").fill("TypeScript, Testing, Playwright");
    await skillsDialog.getByRole("button", { name: "Kaydet" }).click();

    await expect(page.getByText("Profil bilgisi guncellendi.").first()).toBeVisible();
    await expect(page.getByText("Faz 12 icin test odakli bir profil notu.")).toBeVisible();
    await expect(page.getByText("Testing")).toBeVisible();

    await page.goto(phase12TestConfig.e2e.routes.peerProfile);
    await page.getByRole("button", { name: "Takip et" }).click();

    await expect(page.getByText("Takip durumu guncellendi.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Takipten cik" })).toBeVisible();

    await page.goto(phase12TestConfig.e2e.routes.dashboard);
    await expect(page.getByLabel("Takip ettiklerinin feed akisi")).toBeVisible();
    await expect(page.getByText("Node tarafinda sade repository desenini kullanmak isi hizlandirdi.")).toBeVisible();
  });
});