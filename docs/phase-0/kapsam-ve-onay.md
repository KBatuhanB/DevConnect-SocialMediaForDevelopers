# Kapsam ve Onay

## Belge Amaci
Bu belge, DevConnect'in ilk surumunde ne yapacagini ve neyi bilerek disarida biraktigini netlestirir.

## Urun Ozeti
DevConnect, yazilimcilarin teknik icerik paylasabildigi, birbirini takip edebildigi ve birebir mesajlasabildigi bir web uygulamasidir.

## Zorunlu Teslim Ciktilari
- Calisan web uygulamasi
- Kaynak kodlar
- SPMP, SRS, SDD ve STD ile uyumlu guncel uygulama ciktisi
- Kurulum ve calistirma talimati
- Canli veya lokal gosterim senaryosu

## Onayli MVP Kapsami
- E-posta ve sifre ile kayit
- Guvenli giris ve cikis
- Profil goruntuleme ve guncelleme
- Avatar, biyografi ve beceri etiketleri
- Takip etme ve takipten cikma
- Metin, kod ve gorsel odakli post olusturma
- Takip edilen kisilere gore feed listeleme
- Like ve yorum
- Gercek zamanli birebir mesajlasma
- Responsive temel kullanim

## Bilerek Disarida Birakilanlar
- Bildirim sistemi
- Grup mesajlasma
- Video yukleme
- Gelismis arama ve oneriler
- Kullanici adi degistirme
- Mikroservis ayrisimi
- Gelismis yonetim paneli

## Oncelik Sirasi
### P1
- Auth
- Profil ve takip iliskisi
- Post olusturma
- Feed

### P2
- Medya yukleme
- Like ve yorum
- DM

### P3
- Sunum rahatligi icin ikincil iyilestirmeler
- Gercek zamanli sayaç veya ince UX iyilestirmeleri

## Birincil Kullanici Yolculuklari
- Kullanici hesap acip giris yapar.
- Profilini temel bilgilerle tamamlar.
- Bir veya daha fazla kullaniciyi takip eder.
- Ilk postunu olusturur.
- Feed uzerinden etkileşim kurar.
- Baska bir kullanici ile DM baslatir.

## Varsayimlar
- Ilk surumde tek veri kaynagi PostgreSQL olacaktir.
- Kimlik bilgileri Supabase Auth tarafinda yonetilecektir.
- Profil verisi ayri bir `profiles` tablosunda tutulacaktir.
- Kodlar gereksiz komplekslikten kacinacak sekilde yazilacaktir.
- Degisebilir tum degerler ilgili modullerin `config` dosyasinda tutulacaktir.
- Yorumlar Turkce, kisa ve bakimi kolaylastiracak sekilde yazilacaktir.
- GitHub, Supabase ve deployment hesap erisimleri ekipte hazir kabul edilmektedir.
- Ekip, en az haftalik entegrasyon ritmine uyacak zaman bulabilecektir.
- Ders tesliminde calisan demo icin en az bir yedek gosterim senaryosu hazirlanacaktir.

## Faz 0 Onay Maddeleri
- Bu kapsamin ilk surum icin yeterli oldugu kabul edildi mi?
- Kapsam disi maddelere su an icin sadik kalinacak mi?
- P1, P2 ve P3 dengesi bu sekilde uygun mu?

## Not
Bu belge onay aldiginda Faz 1 mimari kararlarina dogrudan girdi olacaktir.