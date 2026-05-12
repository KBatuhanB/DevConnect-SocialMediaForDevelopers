# Modul Sinirlari ve Klasor Sozlesmesi

## Amac
Bu belge, Faz 2'de kurulacak repo yapisinin neden bu sekilde bolunecegini aciklar.

## Monorepo Kok Yapisi
```text
apps/
  web/
  api/
packages/
  shared/
infra/
docs/
```

## Kok Klasorlerin Sorumlulugu
- `apps/web`: Next.js web uygulamasi
- `apps/api`: Express API uygulamasi
- `packages/shared`: Ortak tipler, DTO'lar ve tekrar kullanilabilir saf yardimcilar
- `infra`: Migration, altyapi notlari ve ileride environment destek dosyalari
- `docs`: Yasayan proje dokumantasyonu

## Web Tarafi Modul Sozlesmesi
Her feature olabilecek en sade yapiyla kurulur.

```text
feature-name/
  config.ts
  types.ts
  validation.ts
  api.ts
  components/
```

Notlar:
- `config.ts` zorunludur.
- `api.ts`, ilgili feature'in veri erisim yolunu toplar.
- `components/` sadece gercekten birden fazla parca varsa acilir.
- Gerek yoksa ek klasor acilmaz.

## API Tarafi Modul Sozlesmesi
```text
module-name/
  config.ts
  types.ts
  validation.ts
  controller.ts
  service.ts
  repository.ts
```

Notlar:
- `config.ts` zorunludur.
- Kucuk modullerde `repository.ts` yerine tek veri erisim noktasi kullanilabilir.
- Gereksiz helper ve utility dosya patlamasi yapilmaz.

## Config Sozlesmesi
- Her kod grubunun ayri `config.ts` dosyasi olur.
- Degisebilir butun sayilar, esikler, retry sureleri ve limitler burada tutulur.
- Ortamdan gelen degerler once merkezi environment katmaninda okunur, sonra modul config'ine baglanir.
- Bir degeri tahtada degistirmek icin tum kodu arama ihtiyaci olmamasi hedeflenir.

## Yorum Sozlesmesi
- Yorumlar Turkce olur.
- Uzun aciklama yerine kisa ve karar odakli not yazilir.
- Kod zaten acik ise yorum eklenmez.
- Kritik noktalarda ne, neden ve nasil kisa bicimde anlatilir.

## Modul Sinirlari

### Auth Modulu
- Kayit
- Giris
- Cikis
- Oturum dogrulama
- Rate limit ve auth validation

### Profil ve Ag Modulu
- Profil okuma ve guncelleme
- Takip etme ve takipten cikma
- Avatar ve beceri verisi

### Icerik ve Feed Modulu
- Post olusturma ve silme
- Feed listeleme
- Cursor pagination
- Kod blogu gosterimi

### Medya ve Etkilesim Modulu
- Gorsel yukleme
- Like toggle
- Yorum ekleme

### Mesajlasma Modulu
- Mesaj gecmisi
- Mesaj gonderme
- Realtime aboneligi
- Okundu durumu

### Ortak Altyapi Modulu
- Hata modeli
- Request id
- Merkezi config
- Loglama ve health endpoint'leri

## Faz 2'ye Girdi Notu
Faz 2'de repo iskeleti bu belgeye gore kurulacak. Ek klasor ancak gercek bir ihtiyac dogarsa acilacak.