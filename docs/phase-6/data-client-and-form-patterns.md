# Data Client ve Form Patterns

## API Client
- Tum web istekleri `lib/api-client.ts` uzerinden gider.
- `credentials: include` ve ortak hata esleme burada sabitlenmistir.
- Boylece servis cagrilari ekrana dagilmaz.

## Query Stratejisi
- Her feature kendi query key alanini tutar.
- Ornekler:
  - `authQueryKeys.session`
  - `viewerFeatureConfig.queryKeys.me`
- Bu karar, yeni modullerde cache anahtarlarini kontrollu buyutmek icin secildi.

## Form Stratejisi
- Formlar React Hook Form ile kurulur.
- Client-side schema Zod ile tanimlanir.
- Backend ile uyumlu kurallar ayni limitleri kullanir.

## Auth Kalibi
- `features/auth/api.ts`: ham servis cagrisi
- `features/auth/hooks.ts`: query ve mutation katmani
- `features/auth/validation.ts`: client-side schema
- `features/auth/server.ts`: server cookie yardimcisi

## Viewer Kalibi
- `features/viewer/api.ts`: `/api/me` servisi
- `features/viewer/hooks.ts`: query katmani
- `features/viewer/components/viewer-dashboard.tsx`: loading, error, empty ve success desenlerini birlikte gosterir

## Neden Bu Kadar Basit?
- Faz 6'da amac sonsuz soyutlama kurmak degil.
- Yeni ekran yazarken ayni kalibi tekrar kullanmak yeterli olsun diye minimum ama net katman secildi.