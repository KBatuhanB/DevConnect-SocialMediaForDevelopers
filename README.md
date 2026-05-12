# DevConnect

DevConnect, yazilimcilar icin teknik icerik, sosyal ag ve birebir mesajlasma odakli bir web uygulamasidir.

## Faz 14 Durumu
- Monorepo, auth, profil, post, feed ve DM modulleri tamamlandi.
- Vitest + Supertest + Playwright smoke omurgasi aktif.
- Web ve API icin health/ready endpointleri ile deploy hazirligi tamamlandi.
- Faz 14 ile teslim, sunum ve raporlama paketi eklendi.

## Klasor Yapisi
```text
apps/
  web/
  api/
packages/
  shared/
infra/
  supabase/
docs/
```

## Hizli Baslangic
1. Koku dizinde `npm install` calistir.
2. Gerekirse `apps/web/.env.example` ve `apps/api/.env.example` dosyalarini kopyalayip yerel `.env.local` dosyalarini olustur.
3. Web ve API iskeletini birlikte calistirmak icin `npm run dev` komutunu kullan.
4. Kalite kontrolu icin `npm run check` komutunu kullan.

## Temel Komutlar
- `npm run dev`: Web ve API'yi ayni anda calistirir.
- `npm run build`: Tum workspace paketlerini build eder.
- `npm run lint`: Tum depoyu lint eder.
- `npm run test`: Temel testleri calistirir.
- `npm run test:e2e`: Playwright tabanli Faz 12 smoke senaryolarini calistirir.
- `npm run test:phase12`: Vitest ve Playwright kalite katmanlarini arka arkaya calistirir.
- `npm run smoke:ops -- --web-url <url> --api-url <url>`: Deploy sonrasi temel ops smoke kontrolunu kosar.
- `npm run check:delivery`: Faz 14 teslim paketindeki zorunlu dosyalari ve klasorleri dogrular.
- `npm run check`: Lint, test ve build adimlarini arka arkaya calistirir.

## Deploy Hazirligi
- Web icin `apps/web/.env.production.example`, API icin `apps/api/.env.production.example` referans dosyalari eklendi.
- API servis blueprint'i `render.yaml` icinde tanimlandi.
- Ayrintili operasyon notlari `docs/phase-13/` altindadir.

## Teslim Hazirligi
- Faz 14 teslim ve savunma paketleri `docs/phase-14/` altindadir.
- Orijinal raporlar `Muhteris_SRS.pdf`, `Muhteris_SDD.pdf` ve `Muhteris_SPMP.pdf` olarak repo kokunde tutulur.
- Teslim paketi butunlugu `npm run check:delivery` ile hizlica kontrol edilebilir.

## Supabase Notu
- Dashboard proje ref'i: `sqkwilincloarobypfbp`
- Dashboard bolgesi: `eu-central-1`
- Gercek secret degerler repoya yazilmaz.

## Kodlama Notu
- Gereksiz katman acilmaz.
- Her ana kod grubu kendi `config` dosyasini tasir.
- Yorumlar kisa Turkce notlar halinde tutulur.