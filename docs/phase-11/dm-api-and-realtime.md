# Faz 11 API ve Realtime Notlari

## API Yuzeyi
- `GET /api/messages`
  Konusma listesini son mesaja gore sirali dondurur.
- `GET /api/messages/conversations/:partnerId`
  Aktif kullanici ile hedef profil arasindaki DM gecmisini cursor ile dondurur.
- `POST /api/messages`
  Yeni DM kaydi olusturur.
- `POST /api/messages/conversations/:partnerId/read`
  Hedef profilden gelen ve okunmamis mesajlari okunduya ceker.
- `GET /api/messages/realtime-auth`
  Browser istemcisinin Supabase Realtime kanalina baglanmasi icin o anki access token'i dondurur.

## Veri Kurallari
- 1'e 1 mesajlasma icin self-DM hem veritabaninda hem servis katmaninda engellenir.
- Mesaj icerigi istemci ve sunucuda `5000` karakter limitiyle korunur.
- Mesaj zaman damgasi veritabanindan gelir; istemci sadece gorunur durum yazar.
- RLS nedeniyle yalnizca mesajin gondericisi veya alicisi ilgili kaydi gorebilir.
- Okundu guncellemesi yalnizca alici tarafindan yapilabilir.

## Realtime Akisi
- Web istemcisi once REST ile konusma gecmisini yukler.
- Ardindan ayni thread icin Supabase Realtime kanali acilir.
- `INSERT` olaylari yeni mesajlari, `UPDATE` olaylari okundu bilgisini gunceller.
- Kanal koparsa istemci `1s`, `2s`, `4s`, `8s` gecikmelerle ve sinirli sayida yeniden dener.
- Maksimum deneme asildiginda ekran kullaniciya baglantinin kapali oldugunu acikca gosterir.

## Bilinen Sinirlar
- Bu workspace icinden canli veritabaninda `EXPLAIN ANALYZE` veya 50 kullanicilik yuk testi calistirilmadi.
- Bu nedenle performans ve dayanıklılık notlari tasarim ve kod incelemesi seviyesinde dogrulandi; Faz 12'de olcumlu test gerekecek.