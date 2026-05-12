# ADR-004 Veri Platformu ve Depolama

## Durum
Onaylandi

## Baglam
Ilk surum kapsaminda birden fazla veri platformu kullanmak gereksiz komplekslik olusturur.

## Karar
Ilk surumde tek veri platformu PostgreSQL olacaktir. Mesajlar dahil iliskisel veri Supabase PostgreSQL uzerinde tutulacaktir. Storage tarafinda avatar ve post medyasi icin ayri bucket kullanilacaktir.

## Gerekce
- Tek veri kaynagi daha basittir.
- Ders projesi icin bakim ve demo kolaylasir.
- Storage ayrimi guvenlik ve operasyon tarafini temiz tutar.

## Sonuclar
- MongoDB ilk surume alinmayacaktir.
- Faz 3 migration ve storage politikasi bu karara gore kurulacaktir.