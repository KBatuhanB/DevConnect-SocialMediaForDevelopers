# Calisma Sozlesmesi

## Amac
Bu belge, ekibin projeyi ayni kalite ve sadelik ilkesiyle gelistirmesini saglar.

## Ekip Rolleri
- Berkay: Auth, profil, takip ve ilgili veri yetkileri
- Batuhan: Icerik, feed, medya ve UI akislari
- Berat: Gercek zamanli mesajlasma, baglanti dayanikliligi ve yuk testleri
- Ortak alanlar: CI, dokumantasyon, entegrasyon ve kritik kararlar

## Yedek Sorumlular
- Berkay'in yedegi: Batuhan
- Batuhan'in yedegi: Berkay
- Berat'in yedegi: Batuhan
- Yetki matrisi sahibi: Batuhan
- Yetki matrisi yedek sahibi: Berkay

## Onerilen Calisma Ritmi
- Sprint suresi: 1 hafta
- Haftalik entegrasyon kontrolu: 1 kez
- Kisa durum senkronu: gerektikce ama en az haftada 2 kez
- Sprint sonu: kucuk demo ve geriye donuk risk kontrolu

## Branch ve PR Kurallari
- Ana dal: `main`
- Ozellik dali: `feature/<konu>`
- Duzeltme dali: `fix/<konu>`
- Dokuman dali: `docs/<konu>`
- Her is, inceleme gormeden ana dala birlesmez.

## PR Inceleme Standardi
- Her PR tek bir amaca hizmet etmelidir.
- PR aciklamasi amac, kapsama giren dosyalar ve dogrulama adimini icermelidir.
- Config degisiklikleri PR aciklamasinda ayri satir olarak belirtilmelidir.
- Gereksiz komplekslik veya gereksiz dosya artisi tespit edilirse PR geri cevrilir.
- Kisa Turkce yorum gerektiren kritik bloklar yorumsuz birakilmaz.

## Is Tipleri
- Gorev: Yeni bir planli is parcasi
- Hata: Beklenen davranistan sapma
- Iyilestirme: Var olan akisin daha iyi hale getirilmesi
- Dokumantasyon: Kod degisikligi gerektirmeyen belge guncellemesi
- Karar: Mimari veya surec karari gerektiren konu

## Kodlama Kurallari
- Kod, isi cozmeye yetecek kadar basit olacaktir.
- Gereksiz pattern, gereksiz helper ve gereksiz dosya bolunmesi yapilmayacaktir.
- Her modul veya feature kendi `config.ts` dosyasina sahip olacaktir.
- Degisebilir degerler is koduna gomulmeyecektir.
- Magic number sadece gercekten sabit alanlarda kalacaktir.
- Kisa Turkce yorumlar yalnizca gerekli yerde yazilacaktir.
- Yorumlar ne, neden ve nasil dengesini kisa bicimde aciklayacaktir.

## Onerilen Klasor Yapisi
Bu yapi Faz 1 ve Faz 2'de uygulanacaktir:

```text
apps/
  web/
  api/
packages/
  shared/
infra/
docs/
```

## Modul Seviyesi Klasor Kurali
Her ana modulde asgari olarak su dosya mantigi korunur:

```text
<modul>/
  config.ts
  types.ts
  service.ts
  validation.ts
```

Gerekiyorsa ek dosya acilir. Gerek yoksa yeni katman olusturulmaz.

## Ortam Ayrimi
- Development, test ve production ayri dusunulecektir.
- Test verisi gercek veriyle karismayacaktir.
- Ortam degiskenleri kod icinde tutulmayacaktir.

## Rapor ve Kod Eslestirme Kurali
- SPMP degisikligi gerekiyorsa takvim, sorumluluk veya surec etkilenmis demektir.
- SRS degisikligi gerekiyorsa urun davranisi veya kapsam etkilenmis demektir.
- SDD degisikligi gerekiyorsa mimari, veri modeli veya teknik topoloji etkilenmis demektir.
- Kodda bu uc alandan birine etki eden degisiklik yapildiginda ilgili belge ayni is akisi icinde guncellenecektir.
- Kod birlesimi yapilip belge sonradan guncellenmeyecektir.

## Kritik Onay Gerektiren Alanlar
- Veri modeli degisikligi
- Auth ve RLS karar degisikligi
- Deployment topolojisi degisikligi
- MVP kapsam degisikligi

## Faz 0 Onay Maddeleri
- Sprint ritmi uygun mu?
- Branch kurallari uygun mu?
- Basit kod, config ve yorum standardi ortak ekip kurali olarak kabul edildi mi?
- Yetki matrisi sahipligi ve yedekleri uygun mu?