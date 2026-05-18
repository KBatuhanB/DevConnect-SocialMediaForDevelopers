import { expect, test } from "@playwright/test";
import { phase12TestConfig } from "../config/phase-12.config";
import { authenticateBrowserContext, installMockDevConnectApi } from "./support/mock-devconnect-api";

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
    await expect(page.getByLabel("Profil ayarlari")).toBeVisible();
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
    await expect(page.getByLabel("Takip ettiklerinin feed akisi")).toBeVisible();
    await expect(page.getByLabel("Kullanici ara")).toBeVisible();
  });

  test("dashboard aramasi 500 ms sonra istek atar ve profile gider", async ({ page }) => {
    await installMockDevConnectApi(page);

    const searchQueries: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());

      if (url.pathname === "/api/profiles/search") {
        searchQueries.push(url.searchParams.get("query") ?? "");
      }
    });

    await page.goto(phase12TestConfig.e2e.routes.auth);
    await page.locator("button", { hasText: "Giris yap" }).first().click();
    await page.getByLabel("E-posta").fill("viewer@devconnect.test");
    await page.getByLabel("Sifre").fill("guvenliSifre123");
    await page.locator("form").getByRole("button", { name: "Giris yap" }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    const searchInput = page.getByLabel("Kullanici ara");
    await searchInput.pressSequentially("peer", { delay: 120 });

    await page.waitForTimeout(300);
    expect(searchQueries).toHaveLength(0);

    await expect.poll(() => searchQueries.length).toBe(1);
    expect(searchQueries).toEqual(["peer"]);

    await page.getByRole("link", { name: /peer_engineer/i }).click();

    await expect(page).toHaveURL(phase12TestConfig.e2e.routes.peerProfile);
    await expect(page.getByRole("heading", { name: "peer_engineer", exact: true })).toBeVisible();
  });

  test("cikis yap auth ekranina tam yonlendirme ile doner", async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);

    await page.goto(phase12TestConfig.e2e.routes.dashboard);

    await page.getByLabel("Cikis yap").click();

    await expect(page).toHaveURL(new RegExp(`${phase12TestConfig.e2e.routes.auth}$`));
    await expect(page.getByAltText("DevConnect logo")).toBeVisible();
    await expect(page.getByRole("button", { name: "Giris yap" }).first()).toBeVisible();
  });

  test("korumali 404 ekraninda app bar gorunur ve kart sade gorunur", async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);

    await page.goto(`${phase12TestConfig.e2e.routes.dashboard}/olmayan-sayfa`);

    await expect(page.getByLabel("Takip ettiklerinin feed akisi")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bu ekran DevConnect haritasinda yer almiyor" })).toBeVisible();
    await expect(page.locator(".status-code-pill")).toBeVisible();
    await expect(page.locator(".status-shortcut")).toHaveCount(0);
  });

  test("profilde bos paylasim alaninda eski ust etiket gosterilmez", async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);

    await page.goto(phase12TestConfig.e2e.routes.profile);

    await expect(page.getByRole("heading", { name: "Paylasimlarin" })).toBeVisible();
    await expect(page.getByText("Paylasim alani", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Benim profilim", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Kisa profil ozeti", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Etiketler", { exact: true })).toHaveCount(0);
  });

  test("sag alttaki yeni paylasim butonu composer acip post olusturur", async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);

    await page.goto(phase12TestConfig.e2e.routes.dashboard);

    await page.getByRole("button", { name: "Yeni paylasim" }).click();
    await expect(page.getByRole("heading", { name: "Yeni paylasim" }).last()).toBeVisible();

    await page.getByLabel("Icerik").fill("FAB uzerinden olusturulan yeni bir post.");
    await page.getByRole("button", { name: "Paylasimi olustur" }).click();

    await expect(page.getByText("Paylasim olusturuldu.")).toBeVisible();
    await expect(page.getByText("FAB uzerinden olusturulan yeni bir post.")).toBeVisible();
  });

  test("post kartlarinda begeni ve yorum etkilesimi calisir", async ({ context, page }) => {
    await installMockDevConnectApi(page);
    await authenticateBrowserContext(context);

    await page.goto(phase12TestConfig.e2e.routes.peerProfile);

    const postCard = page.locator(".post-item").filter({ hasText: "Node tarafinda sade repository desenini kullanmak isi hizlandirdi." }).first();

    await postCard.getByRole("button", { name: /Begen/i }).click();
    await expect(postCard.getByRole("button", { name: /Begenildi/i })).toBeVisible();
    await expect(postCard.getByRole("button", { name: /Begenildi/i })).toContainText("1");

    await postCard.getByRole("button", { name: /Yorumlar/i }).click();
    await postCard.getByPlaceholder("Paylasima yorum ekle").fill("Harika not, ayni deseni ben de kullaniyorum.");
    await postCard.getByRole("button", { name: "Yorum gonder" }).click();

    await expect(postCard.getByText("Harika not, ayni deseni ben de kullaniyorum.")).toBeVisible();
    await expect(postCard.getByRole("button", { name: /Yorumlar/i })).toContainText("1");
  });
});