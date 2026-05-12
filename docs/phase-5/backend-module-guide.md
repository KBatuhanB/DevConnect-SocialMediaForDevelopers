# Backend Module Guide

## Amac
Yeni bir backend modulu eklenirken herkes ayni sade kalibi izlesin.

## Modul Dosyalari
- `config.ts`: Route, alan listesi, limit ve sabit davranislar.
- `routes.ts`: Endpoint kaydi ve middleware baglama noktasi.
- `controller.ts`: Request alir, service'e gecer, ortak cevap helper'ini kullanir.
- `service.ts`: Is kurallarini tasir.
- `repository.ts`: Veriye ulasir.
- `types.ts`: Modulun yerel tipleri.

## Katman Kurallari

### Route
- Sadece endpoint ve middleware baglar.
- Is kurali yazmaz.

### Controller
- Ince kalir.
- Request'ten gereken minimum veriyi toplar.
- Basari yanitini `sendSuccess` ile dondurur.
- Beklenmeyen hatayi `next(error)` ile merkezi hata yakalayiciya birakir.

### Service
- Asil is kurali burada olur.
- Repository'den gelen sonucu urun kuralina gore yorumlar.
- Gerektiginde kontrollu `AppError` firlatir.

### Repository
- Veritabani cagrisi burada kalir.
- Ham sorgular controller veya service katmanina dagilmaz.

## Auth Baglami
- Korumali endpoint'lerde `requireAuth` middleware'i kullanilir.
- Middleware basariliysa `request.user` ve `request.accessToken` yazilir.
- User baglamli Supabase sorgulari `createUserSupabaseClient` ile acilir.

## Supabase Client Kurali
- Public auth akislari: `createPublicSupabaseClient`
- Kullanici baglamli RLS sorgulari: `createUserSupabaseClient`
- Dar ve kontrollu admin ihtiyaci: `createServiceSupabaseClient`

## Ornek
- `viewer` modulu Faz 5 referans moduludur.
- Sonraki fazlarda benzer yapida `profile`, `follow`, `post` modulleri eklenmelidir.