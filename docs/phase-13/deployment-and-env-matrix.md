# Deployment and Env Matrix

## Hedef Topoloji
- Web: Vercel
- API: Render
- Veri ve auth: Supabase

Bu secim Faz 1'de alinan topoloji kararini korur. Faz 13'te yeni platform acilmadi, sadece deploy hazirligi yazili hale getirildi.

## Deploy Sirasi
1. Supabase migration ve policy kontrolu
2. Render API deploy
3. Vercel web deploy
4. Ops smoke komutu
5. Manuel kritik akis kontrolu

## Web Environment Degerleri
- `NEXT_PUBLIC_SUPABASE_URL`: Production Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Production anon key
- `NEXT_PUBLIC_API_BASE_URL`: Render API base URL

Referans dosya: `apps/web/.env.production.example`

## API Environment Degerleri
- `PORT`: Render icin servis portu
- `WEB_ORIGIN`: Virgulle ayrilan izinli web domain listesi
- `SUPABASE_URL`: Production Supabase URL
- `SUPABASE_ANON_KEY`: Sunucu tarafi anon key ihtiyaci icin public anahtar
- `SUPABASE_SERVICE_ROLE_KEY`: Sadece server secret
- `SUPABASE_PROJECT_REF`: Supabase proje ref'i
- `SUPABASE_REGION`: Bolge bilgisi
- `COOKIE_SECURE`: Production'da `true`

Referans dosya: `apps/api/.env.production.example`

## Domain ve CORS Notu
- API artik tek origin yerine virgulle ayrilan origin listesi kabul ediyor.
- Onerilen liste: production domain + gerekiyorsa tek preview domain.
- Gereksiz wildcard veya tum preview domainlerini acmak yok.

## Vercel Kurulum Notu
1. Repository'yi Vercel'e bagla.
2. Root directory olarak `apps/web` sec.
3. Environment degerlerini production ortaminda tanimla.
4. Build sonucu olarak Next.js varsayilan akisini kullan.

## Render Kurulum Notu
1. Repository'yi Render'a bagla.
2. `render.yaml` kullan veya ayni alanlari elle tanimla.
3. Secret degerlerini Render dashboard uzerinden gir.
4. Health check yolu olarak `/ready` kullan.

## Kullaniciya Kalan Somut Isler
1. Production domainleri netlestir.
2. Vercel ve Render hesap baglantilarini yap.
3. Secret alanlarini doldur.
4. Ilk deploy sonrasi smoke workflow'unu kos.