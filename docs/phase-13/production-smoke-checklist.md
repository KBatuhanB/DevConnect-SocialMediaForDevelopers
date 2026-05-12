# Production Smoke Checklist

## Otomatik Adim
1. `Ops Smoke` workflow'unu calistir.
2. Ya da lokal makineden su komutu kos:

```bash
npm run smoke:ops -- --web-url https://web.example.com --api-url https://api.example.com
```

## Otomatik Smoke Beklentileri
- Web `/health` 200 donmeli.
- Web `/ready` 200 donmeli.
- Web `/auth` sayfasi 200 donmeli.
- API `/health` 200 donmeli.
- API `/ready` 200 donmeli.

## Manuel Kontrol Listesi
1. Auth sayfasi aciliyor.
2. Login sonrasi dashboard aciliyor.
3. Profil sayfasi ve avatar alanlari yukleniyor.
4. Feed icerigi geliyor veya bos durum kirilmiyor.
5. DM sayfasi aciliyor ve thread secimi hata vermiyor.

## Kayit Altina Alinacaklar
- Deploy zamani
- Web URL
- API URL
- Smoke sonucu
- Varsa hata ekran goruntusu ve kisa not

## Bilerek Disarida Birakilanlar
- Canli yuk testi
- SQL seviyesinde otomatik RLS dogrulamasi
- Like/comment modulu canli smoke'u