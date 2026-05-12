# Profile Module Guide

## Backend Yapisi
- `config.ts`: Route, limit, avatar ve mime turleri.
- `validation.ts`: Parametre ve body dogrulama semalari.
- `controller.ts`: Ince request katmani.
- `service.ts`: Profil sahipligi, self-follow engeli ve avatar yorumlari.
- `repository.ts`: Supabase profile, follow, post sayaci ve storage cagrilari.
- `types.ts`: Modulun yerel DTO ve context tipleri.

## Frontend Yapisi
- `config.ts`: Route, API yolu, form ve mesaj sabitleri.
- `validation.ts`: RHF + Zod form kurallari ve skill parse yardimcilari.
- `api.ts`: Profil ve follow istekleri.
- `hooks.ts`: Query ve mutation katmani.
- `components/profile-workspace.tsx`: Kendi profilin ve diger kullanici profili icin ortak ekran.

## Temel Kurallar
- Profil guncelleme sadece bio ve skills alanlarini degistirir.
- Baska kullanicinin profili okunabilir ama duzenlenemez.
- Self-follow hem UI hem service katmaninda reddedilir.
- Takipten cikma akisi idempotent tutulur.
- Follow ve avatar mutasyonlari sonrasi viewer ve profile cache anahtarlari invalidation alir.