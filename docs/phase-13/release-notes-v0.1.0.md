# Release Notes v0.1.0

## Ozet
DevConnect v0.1.0, auth, profil, post, feed, DM ve temel operasyon hazirligini birlestiren ilk release adayidir.

## Dahil Olan Alanlar
- Cookie tabanli auth ve protected route yapisi
- Profil, avatar ve follow akislari
- Post olusturma, listeleme ve feed deneyimi
- Birebir mesajlasma ve realtime toparlama davranisi
- Vitest, Supertest ve Playwright smoke kalite katmani
- Deploy smoke, health ve rollback omurgasi

## Operasyon Notu
- Web icin Vercel, API icin Render topolojisi korunur.
- Production env degerleri platform secret alanlarinda tutulmalidir.
- Ilk canli deploy sonrasi `Ops Smoke` workflow'u zorunlu kabul edilir.

## Bu Release'te Bilerek Ertelenenler
- Otomatik canli load testi
- SQL seviyesinde tam RLS otomasyonu
- Like/comment modulu canli akisi