# Auth Flow ve Session Stratejisi

## Temel Akislar

### Register
- Kullanici adi, e-posta ve sifre API'ye gider.
- API bu veriyi Zod ile dogrular.
- Gecerliyse Supabase `signUp` cagrisi yapilir.
- Session donerse access token `HTTPOnly` cookie'ye yazilir.
- Session donmezse kullaniciya e-posta dogrulamasi gerekebilecegi bildirilir.

### Login
- E-posta ve sifre API'ye gider.
- API girdi dogrulamasini calistirir.
- Supabase `signInWithPassword` ile kullanici dogrulanir.
- Basariliysa access token cookie'ye yazilir.

### Logout
- API cookie'yi temizler.
- Boylece tarayici yeni korumali isteklere token tasimaz.

### Session Kontrolu
- Web auth ekrani `GET /api/session` ile aktif oturumu sorar.
- API middleware access token cookie'sini okuyup Supabase uzerinden dogrular.
- Gecerliyse `request.user` doldurulur.

## Session Karari
- Tarayici tarafinda token'ı `localStorage` yerine `HTTPOnly` cookie'de tutuyoruz.
- Bu secim XSS etkisini azaltmak icin tercih edildi.
- Simdilik yalnizca access token tutulur.
- Token suresi doldugunda kullanici tekrar login olur.

## Neden Refresh Akisi Yok?
- Faz 4'te gereksiz karmasikligi buyutmemek icin refresh akisi bilerek ertelendi.
- Bu MVP seviyesinde daha az moving part ile daha net hata ayiklama saglar.
- Gerekirse Faz 12 veya operasyon fazinda refresh politikasina gecilebilir.

## Profil Satiri Notu
- Faz 3'te eklenen `handle_new_user` trigger'i auth kaydi sonrasinda `public.profiles` satirini otomatik olusturur.
- Bu nedenle Faz 4'te ayri profil olusturma endpoint'i yazilmadi.