# Faz 5 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Kod, test ve build dogrulamasi alindi. Bu adimlar sadece ek kontrol icindir.

## Adimlar
1. Root klasorde `npm run dev` calistir.
2. `/auth` ekranindan giris yap.
3. Giris sonrasi terminalde veya tarayici istemcisinde `GET /api/me` istegi at.
4. Cevabin `success: true` ve `data.profile` tasidigini kontrol et.
5. Cikistan sonra ayni `GET /api/me` istegini tekrar dene.
6. Bu kez `AUTH_REQUIRED` ve `401` dondugunu kontrol et.

## Beklenen Sonuc
- Request id header'i cevaplarda bulunur.
- Basari ve hata cevaplari ayni contract ile gelir.
- Auth baglami olmayan istek `GET /api/me` icin engellenir.