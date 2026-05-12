# Rollback and Recovery

## Rollback Tetikleyicileri
- `Ops Smoke` basarisiz olursa
- Login veya session akisi kirilirse
- API `/ready` surekli hata verirse
- Mesajlasma veya feed kritik yolunda yaygin 5xx gorulurse

## Rollback Sirasi
1. Web deploy'unu bir onceki saglam release'e al.
2. API deploy'unu bir onceki saglam release'e al.
3. Gerekirse env degisikliklerini bir onceki onayli sete dondur.
4. Migration kaynakli sorun varsa Supabase tarafinda yazili geri donus adimini uygula.

## Veritabani ve Yedek Notu
- Supabase production'da migration oncesi yedek alinmali.
- Riskli migration varsa once staging veya clone veride denenmeli.
- Geri alinmasi zor migration'larda deploy penceresi kisa tutulmali.

## Hangi Durumda Sadece Web Rollback Yeterli
- Yalnizca UI route hatasi varsa
- API health ve auth duzgun calisiyorsa
- Yeni Next.js header veya route degisikligi yanlis davranis uretiyorsa

## Hangi Durumda API Rollback Zorunlu
- `/health` veya `/ready` bozulduysa
- CORS yanlis origin reddi uretiyorsa
- Cookie/session davranisi koptuysa
- Supabase erisimi ya da service role akisinda hata varsa

## Olay Sonrasi Kisa Inceleme
- Hangi release kirildi?
- Hangi smoke adimi ilk kez hata verdi?
- Sorun env mi, kod mu, migration mi?
- Yeni bir kalici kontrol gerekli mi?

## Kullaniciya Kalanlar
- Supabase backup planini dashboard uzerinden aktif kullanmak.
- Rollback icin onceki saglam deploy referanslarini platform uzerinde saklamak.