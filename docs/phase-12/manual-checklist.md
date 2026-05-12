# Faz 12 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Otomatik testler calisti. Bu adimlar gercek servis ve iki kullanicili akis kontrolu icindir.

## Adimlar
1. Root klasorde `npm run dev` calistir.
2. Iki farkli hesapla ayri tarayici profillerinde giris yap.
3. Birinci hesapla profil bilgini guncelle ve degisikligin `/profile` ekraninda kaldigini kontrol et.
4. Ikinci hesabin profilini acip takip et.
5. Birinci hesapla dashboard'dan yeni bir text post olustur.
6. Takip iliskisine gore feed'de hem kendi postunu hem takip edilen kullanicinin postunu gordugunu kontrol et.
7. `/messages` ekraninda yeni bir DM gonder.
8. Ikinci hesapta ayni thread'in acildigini ve mesajin okundu durumunun guncellendigini kontrol et.
9. Mobil viewport ile `/dashboard`, `/profile` ve `/messages` ekranlarini tekrar ac.
10. Kritik butonlarin ve alanlarin tasma yapmadigini kontrol et.

## Beklenen Sonuc
- Kritik yol ekranlari temel masaustu ve mobil kullanimda kirilmaz.
- Auth, takip, post ve DM akislari kullanici gozunden tutarli gorunur.
- Otomatik smoke testte korunan davranislar gercek servisle de ayni mantikta calisir.