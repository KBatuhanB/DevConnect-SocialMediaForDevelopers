# Faz 11 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Build dogrulamasi alindi. Bu adimlar ek kontrol icindir.

## Adimlar
1. Root klasorde `npm run dev` calistir.
2. Iki farkli hesapla giris yap.
3. Ilk hesapla ikinci hesabin profilini ac.
4. `Mesaj gonder` linkiyle `/messages` ekranina git.
5. Ilk hesaptan bir mesaj gonder ve satirda once `Gonderiliyor`, sonra `Gonderildi` durumunu gor.
6. Ikinci hesapta `/messages` ekranini ac ve mesajin canli geldigini kontrol et.
7. Ikinci hesap thread'i acinca ilk hesapta giden mesajin durumu `Okundu` olarak guncelleniyor mu kontrol et.
8. Baglantiyi kesmek icin ilgili sekmede agi gecici kapat veya Supabase erisimini blokla.
9. Kanal durum metninin yeniden baglanma denedigini kontrol et.
10. Agi geri ac ve thread'in toparlanabildigini kontrol et.
11. Yeni bir mesaj gondererek akisin kaldigi yerden devam ettigini dogrula.

## Beklenen Sonuc
- Yalnizca ilgili iki kullanici ayni mesajlari gorebilir.
- Mesaj gecmisi tekrarsiz ve tutarli sirada gorunur.
- Gonderim durumlari kullaniciya acikca yansir.
- Kanal kopsa bile arayuz tamamen bozulmaz ve toparlama yolu sunar.