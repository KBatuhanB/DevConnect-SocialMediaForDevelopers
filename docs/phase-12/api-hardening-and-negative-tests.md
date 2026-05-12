# Faz 12 API Sertlestirme ve Negatif Testler

## Otomasyona Alinanlar
- Yetkisizken `401 AUTH_REQUIRED` donmesi gereken korumali rotalar test edildi.
- Auth rate-limit davranisinin kontrollu bicimde `429 AUTH_RATE_LIMIT` verdigi test edildi.

## Test Edilen Yuzeyler
- `GET /api/me`
- `GET /api/feed`
- `GET /api/profiles/me`
- `GET /api/profiles/:profileId`
- `POST /api/posts`
- `GET /api/messages`
- `GET /api/messages/realtime-auth`
- `POST /auth/login` tekrarli istek limiti

## Neden Onemli?
- Faz 12 planindaki `F12-12` ve `F12-13` maddeleri icin somut, calisan kanit uretiyor.
- Auth middleware ile rate-limit davranisinin sadece birim testte degil, gercek route zincirinde de calistigini gosteriyor.

## Bilinen Sinir
- Bu testler RLS seviyesini degil, uygulama seviyesindeki auth ve route korumasini olcer.
- RLS politikalarinin dogrudan SQL tabanli testi icin ayri bir Supabase test veritabani akisi gerekecek.