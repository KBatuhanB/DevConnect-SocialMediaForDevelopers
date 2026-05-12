# Security Foundations

## Uygulanan Temeller
- Auth endpoint'lerinde rate limit var.
- API sadece gerekli web origin'ine CORS izni veriyor.
- `helmet` ile temel HTTP guvenlik basliklari eklendi.
- Hata mesaji sade tutuldu, ic detaylar disari tasinmiyor.
- Korumali API path'leri merkezi auth middleware uzerinden geciyor.

## Request Baglami
- Basarili auth dogrulamasi sonrasi kullanici bilgisi `request.user` alanina yazilir.
- Sonraki backend modulleri bu baglami tekrar token parse etmeden kullanabilir.

## Service Role Karari
- Faz 4 implementasyonunda service role ile yeni auth akisi acilmadi.
- Boylece gereksiz genis yetki kullanimi erken asamada engellendi.
- Service role anahtari yerel env dosyasinda kalir ve istemciye acilmaz.

## Kucuk Tehdit Modeli

### Tehdit 1
- Risk: Token'in istemci JavaScript'i tarafindan okunmasi.
- Onlem: Session `HTTPOnly` cookie'de tutuluyor.

### Tehdit 2
- Risk: Auth endpoint'lerine kaba kuvvet denemesi.
- Onlem: Register ve login endpoint'lerinde rate limit var.

### Tehdit 3
- Risk: Korumali API endpoint'lerine cerezsiz istek.
- Onlem: Middleware 401 dondurur ve kullanici baglami olusturmaz.

### Tehdit 4
- Risk: Hata mesajlarindan ic bilgi sizmasi.
- Onlem: Genel hata cevabi sabit ve sade tutulur.

### Tehdit 5
- Risk: Client route korumasinin tek guvenlik katmani sanilmasi.
- Onlem: Dokumanda ve kod yorumunda asil guvenlik kararinin API + Supabase token dogrulamasinda oldugu acik tutuldu.