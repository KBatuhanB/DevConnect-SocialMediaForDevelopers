# Faz 4 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Kod ve test dogrulamalari alindi. Ama istersen tarayici uzerinden elde de dogrulayabilirsin.

## Calistirma
1. Root klasorde `npm run dev` calistir.
2. Tarayicida `/auth` sayfasini ac.

## Kontrol Adimlari
1. Yeni hesapla kayit ol.
2. Eger sistem e-posta dogrulama isterse Supabase tarafindaki ayara gore e-postayi onayla.
3. Login yap.
4. Login sonrasi `/dashboard` sayfasina gecildigini kontrol et.
5. Tarayicida `/dashboard` adresini yeni sekmede ac ve erisim oldugunu dogrula.
6. `Cikis yap` ile oturumu kapat.
7. Tekrar `/dashboard` acmaya calis ve `/auth` sayfasina yonlendirme aldigini kontrol et.

## Supabase Tarafi Not
- Eger kayit sonrasi session donmuyor ama kullanici olusuyorsa, Supabase Auth icinde e-posta dogrulama acik olabilir.
- Bu durumda iki secenek vardir:
  - E-postayi onaylamak
  - Gelistirme icin email confirmation ayarini kapatmak

## Beklenen Sonuc
- Register calisir.
- Login calisir.
- Logout calisir.
- `/api/session` yalnizca gecerli cookie varken kullanici dondurur.
- Cookie yoksa korumali ekranlar auth sayfasina geri duser.