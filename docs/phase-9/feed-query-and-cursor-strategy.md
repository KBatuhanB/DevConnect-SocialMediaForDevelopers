# Feed Query and Cursor Strategy

## Sorgu Yaklasimi
- Faz 9'da feed icin ayri `feed` modulu acildi.
- Ilk sorgu `follows` tablosundan takip edilen kullanici id'lerini okur.
- Ikinci sorgu `posts` tablosundan bu kullanicilar ve aktif kullanici icin postlari ceker.
- Author temel bilgisi ayni post sorgusuna `profiles` relation'i ile dahil edilir.

## Neden Boyle?
- Gereksiz RPC veya view karmasasi eklenmedi.
- Iki sorgulu yapi N+1 degildir ve mevcut veri boyutu icin sade kalir.
- `posts_created_idx`, `posts_user_created_idx` ve `follows` indeksleri ilk surum icin yeterli taban saglar.

## Cursor Kurali
- Cursor alanlari `created_at` ve `id` ikilisidir.
- Siralama `created_at desc, id desc` olarak sabitlenir.
- Son donen kart sonraki sayfa icin cursor olur.
- Faz 9 service katmani tekrar eden kayitlari id bazli filtreler.

## Invalidation Kurali
- Yeni post olusturma veya silme feed root query anahtarini invalidation alir.
- Takip ve takipten cikma da feed root query anahtarini invalidation alir.
- Boylece dashboard acikken feed gorunumu stale kalmaz.

## Sayi Yaklasimi
- Begeni ve yorum sayilari bu fazda hesaplanmadi.
- Kart formati sabit kalsin diye UI tarafinda Faz 10 placeholder metni kullanildi.