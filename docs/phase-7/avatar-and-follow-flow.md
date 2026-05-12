# Avatar and Follow Flow

## Avatar Akisi
1. Kullanici `/profile` ekraninda dosya secer.
2. Istemci dosya tipi ve boyutunu kontrol eder.
3. Dosya data URL olarak API'ye gonderilir.
4. API content type ve byte limitini tekrar dogrular.
5. Dosya Supabase `avatars` bucket'ina benzersiz yol ile yuklenir.
6. Profil kaydindaki `avatar_path` guncellenir.
7. Varsa eski avatar dosyasi best-effort silinir.
8. Profile ve viewer query cache'leri yenilenir.

## Follow Akisi
1. Kullanici baska bir profile gider.
2. Kendi profili degilse `Takip et` butonu aktif olur.
3. API once hedef profilin varligini kontrol eder.
4. Self-follow service katmaninda reddedilir.
5. Takip kaydi varsa ikinci insert denemesi no-op kabul edilir.
6. Takipten cikma delete akisi guvenli ve idempotent tutulur.
7. Son durumda hedef profil tekrar okunur ve guncel sayaçlar dondurulur.

## Audit Notu
- Faz 3 tablosundaki `updated_at` alani profil guncellemeleri icin yeterli kabul edildi.
- Bu fazda ek audit tablosu acilmadi.