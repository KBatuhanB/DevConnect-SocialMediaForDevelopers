# DevConnect Dokumantasyon Klasoru

Bu klasor, DevConnect projesinin uygulama ve yonetim dokumanlarini tutar.

## Amac
- Proje kararlarini tek yerde toplamak.
- Faz gecislerini yazili kanitla desteklemek.
- Kodlama oncesi kapsam ve calisma duzenini netlestirmek.

## Klasor Yapisi
- `phase-0/`: Faz 0 yonetisim ve kapsam dondurma ciktlari.
- `phase-1/`: Faz 1 hedef mimari, sistem topolojisi ve karar kayitlari.
- `phase-2/`: Faz 2 repo omurgasi ve gelistirme iskeleti.
- `phase-3/`: Faz 3 veri modeli, migration, RLS ve Supabase tabani.
- `phase-4/`: Faz 4 kimlik dogrulama, cookie oturumu ve guvenlik temeli.
- `phase-5/`: Faz 5 ortak backend omurgasi, hata/yanit kalibi ve modul rehberi.
- `phase-6/`: Faz 6 on yuz temeli, tasarim sistemi ve veri istemci kalibi.
- `phase-7/`: Faz 7 profil yonetimi, avatar ve takip akislari.
- `phase-8/`: Faz 8 icerik olusturma, onizleme ve silme akislari.
- `phase-9/`: Faz 9 takip feed'i, cursor pagination ve infinite scroll.
- `phase-11/`: Faz 11 birebir mesajlasma, realtime ve hata toparlama akislari.
- `phase-12/`: Faz 12 test sertlestirme, protected route kontrolleri ve smoke E2E.
- `phase-13/`: Faz 13 deploy, ops smoke, rollback ve release hazirligi.
- `phase-14/`: Faz 14 raporlama, sunum, teslim sertifikasyonu ve savunma notlari.
- `templates/`: Karar kaydi ve benzeri tekrar kullanilabilir sablonlar.

## Faz 0 Dosyalari
- `phase-0/README.md`: Faz 0 ozeti ve onay bekleyen maddeler.
- `phase-0/kapsam-ve-onay.md`: MVP, kapsam disi alanlar, oncelikler ve varsayimlar.
- `phase-0/calisma-sozlesmesi.md`: Ekip calisma duzeni, kodlama kurallari ve klasor yaklasimi.
- `phase-0/risk-ve-degisiklik-kaydi.md`: Baslangic riskleri, rapor celiskileri ve degisiklik kontrolu.
- `phase-0/faz-gecis-ve-kabul-kriterleri.md`: Faz giris-cikis kapilari ve kabul kontrol listesi.
- `phase-0/terimler-sozlugu.md`: Ortak terimler ve kisa tanimlar.
- `templates/karar-kaydi-template.md`: Mimari veya surec kararlarini kaydetmek icin sablon.

## Faz 1 Dosyalari
- `phase-1/README.md`: Faz 1 ozeti, karar listesi ve Faz 2'ye gecis notlari.
- `phase-1/system-topology.md`: Sistem topolojisi, bilesen dagilimi ve sunum ozeti.
- `phase-1/module-boundaries-and-folder-contract.md`: Modul sinirlari, klasor yapisi ve config sozlesmesi.
- `phase-1/data-flow-and-integrations.md`: Ana veri akislari ve entegrasyon yollari.
- `phase-1/operations-and-secrets.md`: Secret, ortam degiskeni, log ve operasyon kararari.
- `phase-1/ownership-and-traceability.md`: Modul sahipligi, veri sahipligi, API sahipligi ve izlenebilirlik.
- `phase-1/adrs/`: Faz 1 mimari karar kayitlari.

## Faz 2 Dosyalari
- `phase-2/README.md`: Faz 2 repo iskeleti ve kalite kapisi ozeti.

## Faz 3 Dosyalari
- `phase-3/README.md`: Faz 3 ozeti, ciktilar ve sonraki faza gecis notu.
- `phase-3/schema-overview.md`: Tablo yapisi, iliskiler ve indeks kararari.
- `phase-3/rls-and-storage-policies.md`: RLS, message gizliligi ve storage politika ozeti.
- `phase-3/how-to-apply-in-supabase.md`: Supabase SQL Editor uzerinden manuel uygulama adimlari.

## Faz 4 Dosyalari
- `phase-4/README.md`: Faz 4 ozeti, teknik ciktilar ve kullaniciya kalan kontroller.
- `phase-4/auth-flow-and-session-strategy.md`: Register, login, logout ve cookie tabanli session kararlari.
- `phase-4/security-foundations.md`: Middleware, rate limit, CORS, hata sadeleştirme ve tehdit modeli ozeti.
- `phase-4/manual-checklist.md`: Tarayici ve Supabase uzerinden elde kontrol adimlari.

## Faz 5 Dosyalari
- `phase-5/README.md`: Faz 5 ozeti, ortak backend tasarimi ve sonraki faza gecis notu.
- `phase-5/backend-module-guide.md`: Route-controller-service-repository sinirlari ve kullanim kurallari.
- `phase-5/response-and-error-contract.md`: Basari/hatali cevap sozlesmesi ve hata kodu listesi.
- `phase-5/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 6 Dosyalari
- `phase-6/README.md`: Faz 6 ozeti, UI temeli ve sonraki faza gecis notu.
- `phase-6/frontend-foundation-guide.md`: Route gruplari, provider yapisi, UI kit ve shell kurallari.
- `phase-6/data-client-and-form-patterns.md`: React Hook Form, Zod, TanStack Query ve auth/viewer hook kaliplari.
- `phase-6/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 7 Dosyalari
- `phase-7/README.md`: Faz 7 ozeti, profil ve sosyal grafik temeli.
- `phase-7/profile-module-guide.md`: Backend ve frontend profil modulu yapisi.
- `phase-7/avatar-and-follow-flow.md`: Avatar, follow, invalidation ve yetki kararlari.
- `phase-7/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 8 Dosyalari
- `phase-8/README.md`: Faz 8 ozeti, post modulu ve sonraki faza gecis notu.
- `phase-8/content-lifecycle-guide.md`: Post olusturma, silme ve profile gore listeleme akisi.
- `phase-8/render-and-preview-notes.md`: Kod, metin ve gorsel onizleme ile temel guvenlik notlari.
- `phase-8/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 9 Dosyalari
- `phase-9/README.md`: Faz 9 ozeti, feed modulu ve sonraki faza gecis notu.
- `phase-9/feed-query-and-cursor-strategy.md`: Takip tabanli sorgu, cursor ve invalidation kararlari.
- `phase-9/feed-ui-and-infinite-scroll.md`: Feed karti, bos durum ve intersection observer akisi.
- `phase-9/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 11 Dosyalari
- `phase-11/README.md`: Faz 11 ozeti, DM modulu ve sonraki faza gecis notu.
- `phase-11/dm-api-and-realtime.md`: Mesajlasma API ve realtime katmani.
- `phase-11/dm-ui-and-recovery.md`: DM UI, optimistic durum ve toparlama davranisi.
- `phase-11/manual-checklist.md`: Opsiyonel elde kontrol adimlari.

## Faz 12 Dosyalari
- `phase-12/README.md`: Faz 12 ozeti ve kalite katmani ciktisi.
- `phase-12/test-strategy-and-scope.md`: Vitest, Supertest ve Playwright kapsami.
- `phase-12/api-hardening-and-negative-tests.md`: Protected route ve rate-limit testleri.
- `phase-12/e2e-smoke-suite.md`: Kritik UI smoke akislari.
- `phase-12/manual-checklist.md`: Gercek servis icin elde kontrol adimlari.
- `phase-12/open-gaps-and-hardening-backlog.md`: Bilerek disarida birakilan sertlestirme maddeleri.

## Faz 13 Dosyalari
- `phase-13/README.md`: Faz 13 ozeti ve kullaniciya kalan adimlar.
- `phase-13/deployment-and-env-matrix.md`: Vercel, Render ve Supabase ortam matrisi.
- `phase-13/operations-runbook.md`: Deploy sirasinda uygulanacak operasyon akisi.
- `phase-13/rollback-and-recovery.md`: Rollback, yedek ve toparlama plani.
- `phase-13/production-smoke-checklist.md`: Canli smoke ve elde kontrol listesi.
- `phase-13/release-notes-v0.1.0.md`: Ilk release notu.

## Faz 14 Dosyalari
- `phase-14/README.md`: Faz 14 ozeti ve kullaniciya kalan son adimlar.
- `phase-14/report-alignment.md`: SRS, SDD ve SPMP ile gercek urun uyum notlari.
- `phase-14/setup-env-api-and-schema.md`: Kurulum, environment, API ve veri modeli ozeti.
- `phase-14/presentation-and-demo-plan.md`: Demo akisi, kritik ekranlar ve yedek senaryo.
- `phase-14/test-summary-limitations-and-defense.md`: Test ozetleri, sinirlar ve savunma cevaplari.
- `phase-14/delivery-certification.md`: Teslim paketi kontrolu, ekip katkisi ve final checklist.

## Not
Bu klasor Faz 0 ile baslar. Faz 1 ve sonrasi ilerledikce yeni dokumanlar ayni sadelik ilkesiyle eklenecektir.