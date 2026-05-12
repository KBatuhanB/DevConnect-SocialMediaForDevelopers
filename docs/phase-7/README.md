# Faz 7 Ozeti

## Hedef
Faz 7'nin amaci, kullanici profilini gercek urun akisina donusturmek ve sosyal grafik icin takip iliskisini calisir hale getirmektir.

## Tamamlanan Isler
- API tarafinda `profiles` modulu eklendi.
- `GET /api/profiles/me` ve `GET /api/profiles/:profileId` ile profil okuma akisi kuruldu.
- `PATCH /api/profiles/me` ile biyografi ve beceri etiketi guncelleme akisi eklendi.
- `POST /api/profiles/me/avatar` ile avatar yukleme akisi eklendi.
- `POST` ve `DELETE /api/profiles/:profileId/follow` ile takip ve takipten cikma akisi eklendi.
- Web tarafinda `/profile` ve `/profile/[profileId]` ekranlari eklendi.
- Profil mutasyonlari sonrasi profile ve viewer query cache katmani yenilenir hale getirildi.
- Profil sayfasinda Faz 8 icin ayrilmis post alani yerleştirildi.

## Faz 7'de Bilerek Basit Tutulanlar
- Kullanici adi degistirme acilmadi.
- Avatar yukleme ilk surumde JSON data URL uzerinden kuruldu; multipart kutuphanesi eklenmedi.
- Follow sayaçlari denormalize alanlar yerine dogrudan sorgu ile okunur tutuldu.
- Profil sayfasinda post listesi yerine kontrollu placeholder birakildi.

## Ciktilar
- `apps/api/src/modules/profiles/*`
- `apps/web/src/features/profiles/*`
- `apps/web/src/app/(protected)/profile/*`
- `apps/web/src/middleware.ts`
- `apps/web/src/app/globals.css`

## Kullaniciya Kalanlar
- Zorunlu bir adim yok.
- Istersen tarayicida avatar, profil ve follow akisini elde test edebilirsin.
- Bunun icin ayrintilar `manual-checklist.md` icinde yazili.

## Faz 8'e Gecis Notu
Icerik olusturma modulu artik hazir profil sayfasi, calisan sosyal grafik ve korunan shell ustune insa edilebilir.