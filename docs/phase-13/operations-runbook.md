# Operations Runbook

## Deploy Oncesi
- `npm run check` temiz olmali.
- Son kritik degisiklik icin `npm run smoke:ops` lokal veya preview ortaminda denenmeli.
- Supabase migration sirasinin dogru oldugu teyit edilmeli.
- Production env degerleri iki kez kontrol edilmeli.

## Deploy Sirasi
1. API deploy'unu baslat.
2. `/health` ve `/ready` cevaplarini kontrol et.
3. Web deploy'unu baslat.
4. Web `health`, `ready` ve `auth` cevaplarini kontrol et.
5. `Ops Smoke` workflow'unu gercek URL'lerle calistir.

## Deploy Sonrasi Komut
Asagidaki komut lokal makineden de kosulabilir:

```bash
npm run smoke:ops -- --web-url https://web.example.com --api-url https://api.example.com
```

## Beklenen Health Davranisi
- Web `/health`: `200` ve `status=ok`
- Web `/ready`: `200` ve `status=ok`
- API `/health`: `200` ve `success=true`
- API `/ready`: `200` ve `success=true`

## Izleme ve Log Kontrolu
- Render loglarinda 5xx ve boot loop aranmali.
- Vercel loglarinda server component veya route handler hatasi aranmali.
- API loglarinda `requestId` akisi ve auth hatalari kontrol edilmeli.
- Supabase dashboard uzerinde auth, database ve storage hata sivrilmeleri izlenmeli.

## Kritik Manuel Kontroller
- Register veya login akisi aciliyor mu?
- Profil sayfasi yukleniyor mu?
- Feed bos veya dolu durumda hata vermeden geliyor mu?
- DM listesi ve thread sayfasi aciliyor mu?

## Not
Like ve comment modulu bu workspace'te olmadigi icin Faz 13 canli smoke listesine dahil edilmedi.