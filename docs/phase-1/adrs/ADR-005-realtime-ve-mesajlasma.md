# ADR-005 Realtime ve Mesajlasma

## Durum
Onaylandi

## Baglam
DM modulu anlik iletisim ister, ancak ilk surumde gereksiz ikinci bir realtime yigi kurmak risklidir.

## Karar
Ilk surumde birebir mesajlasma icin Supabase Realtime ana cozum olacaktir. Socket.IO sadece ileride gerekirse yedek secenek olarak kalacaktir.

## Gerekce
- Tek servis yigi daha basittir.
- Supabase altyapisi mevcut veri modeliyle daha hizli uyum saglar.
- Faz 1 ve Faz 2'de gereksiz teknik yuk olusmaz.

## Sonuclar
- Faz 11 mesajlasma modulu bu karar uzerinden tasarlanacaktir.
- Socket.IO ilk surum backlog'unda aktif gelistirme almayacaktir.