# Faz 9 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Build ve test dogrulamasi alindi. Bu adimlar ek kontrol icindir.

## Adimlar
1. Root klasorde `npm run dev` calistir.
2. `/auth` ekranindan giris yap.
3. Baska bir kullaniciyi takip et.
4. Takip edilen kullanici hesabiyla en az bir post olustur.
5. Ilk kullaniciyla `/dashboard` ekranina don.
6. Feed kartinda takip edilen kullanicinin postunu gordugunu kontrol et.
7. Kendi olusturdugun postlarin da ayni feed icinde yer aldigini kontrol et.
8. Sayfa asagi kaydirildiginda yeni veriler varsa otomatik yüklendigini kontrol et.
9. Takipten cik ve dashboard'a don.
10. Ilgili kullanicinin iceriginin feed'den kayboldugunu kontrol et.

## Beklenen Sonuc
- Feed yalnizca takip edilen kullanicilar ve aktif kullanicinin kendi postlarini gosterir.
- Ayni kart iki kez gorunmez.
- Bos, hata ve yukleniyor durumlari kontrollu davranir.
- Follow veya post mutasyonu sonrasi feed stale kalmaz.