# Supabase Notlari

## Mevcut Proje Bilgisi
- Dashboard baglantisi: `https://supabase.com/dashboard/project/sqkwilincloarobypfbp`
- Project ref: `sqkwilincloarobypfbp`
- Region: `eu-central-1`
- API URL: `https://sqkwilincloarobypfbp.supabase.co`

## Faz 3 Notu
- Migration dosyalari `migrations/` altina eklendi.
- Seed stratejisi `seed.sql` ile yazili hale getirildi.
- Yerel `.env.local` dosyalari uygulama klasorlerinde hazirlandi.
- Gercek tablo uygulamasi icin Supabase SQL Editor veya veritabani baglantisi gerekir.

## Sonraki Fazlarda Gerekecekler
- Faz 4 icin auth akisina baglanacak istemci modulu
- Faz 5 ve sonrasi icin gercek servis cagrilari
- Istenirse ileride Supabase CLI ile migration akisinin otomasyonu

## Guvenlik Notu
`service_role` anahtari ve database sifresi repoya yazilmaz.

## Manuel Uygulama Notu
Supabase tarafina gercek tablo ve politika kurulumu yapmak icin `docs/phase-3/how-to-apply-in-supabase.md` dosyasindaki adimlar izlenir.