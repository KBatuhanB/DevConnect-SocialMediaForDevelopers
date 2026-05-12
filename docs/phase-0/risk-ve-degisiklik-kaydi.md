# Risk ve Degisiklik Kaydi

## Raporlardan Cikan Baslangic Celiskileri ve Cozumleri
- `users` varligi mantiksal olarak tek, fiziksel olarak `auth.users` ve `public.profiles` ayrimi ile kurulacaktir.
- Next.js tarafi yalnizca SPA gibi dusunulmeyecek, hibrit App Router yaklasimi kullanilacaktir.
- Web ve API ayni deployment modeliyle zorlanmayacak, ayri servis mantigi benimsenecektir.
- `login` ve `register` kamu uclaridir; diger korunan uclar auth ister.
- Ilk surumde tek syntax highlighting cozumu kullanilacaktir.
- Ilk surumde MongoDB eklenmeyecek, PostgreSQL tek veri kaynagi olacaktir.

## Baslangic Risk Kaydi
| ID | Risk | Etki | Sahip | Onlem |
| --- | --- | --- | --- | --- |
| R-01 | Feed sorgularinin yavaslamasi | Yuksek | Batuhan | Erken indeksleme ve cursor pagination |
| R-02 | RLS yanlisligi ile veri sizintisi | Cok yuksek | Berkay | Varsayilan reddetme ve negatif test |
| R-03 | DM baglantilarinin kopmasi | Yuksek | Berat | Reconnect ve mesaj durum yonetimi |
| R-04 | Degisebilir degerlerin koda dagilmasi | Orta | Tum ekip | Modul bazli `config` disiplini |
| R-05 | Kodun gereksiz karmaşiklasmasi | Yuksek | Tum ekip | Kod incelemesinde sadelik kontrolu |
| R-06 | Sunum aninda hizli degisiklik yapamama | Orta | Tum ekip | Kritik esiklerin config dosyalarinda tutulmasi |

## Baslangic Teknik Borc Kaydi
- Faz 1 oncesi kesinlesmesi gereken deployment platform secimi
- Faz 1 oncesi kesinlesmesi gereken syntax highlighting secimi
- Faz 2'de ortak config naming standardinin tek hale getirilmesi

## Ilk Karar Bekleyen Konular
- API deployment platformu `Render` mi yoksa `Railway` mi olacak?
- Syntax highlighting icin `Shiki` mi benzeri tek bir alternatif mi secilecek?
- Sprint suresi kesin olarak 1 hafta mi olacak?

## Degisiklik Kontrol Mekanizmasi
1. Degisiklik talebi tek cumle ile yazilir.
2. Etkilenen kapsam, mimari ve teslim tarihi belirlenir.
3. Talep P1, P2 veya P3 etkisine gore etiketlenir.
4. Karar, `karar-kaydi-template.md` ile kayda gecirilir.
5. Onaylanan degisiklik plan ve ilgili dokumanlara ayni gun islenir.
6. Kapsam disiysa backlog'a alinir, mevcut faz bozulmaz.

## Faz 0 Onay Maddeleri
- Yukaridaki celiski cozumleri kabul edildi mi?
- Risk sahipleri bu haliyle uygun mu?
- Degisiklik kontrol akisi fazla agir olmadan yeterli mi?