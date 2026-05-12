# Supabase Uzerinde Manuel Uygulama Adimlari

## Neden Manuel?
Bu asamada Supabase'a tablo kurmak icin en sade ve risksiz yol SQL Editor kullanmaktir. Database sifresi veya farkli yonetim tokenlari istemeden ilerlenir.

## Adimlar
1. Supabase dashboard ac.
2. Sol menuden `SQL Editor` bolumune gir.
3. Yeni bir sorgu penceresi ac.
4. `infra/supabase/migrations/0001_initial_schema.sql` dosyasinin tum icerigini kopyala.
5. SQL Editor icine yapistir.
6. `Run` ile calistir.
7. Hata yoksa ikinci sorgu penceresini ac.
8. `infra/supabase/migrations/0002_rls_and_storage.sql` dosyasinin tum icerigini kopyala.
9. SQL Editor icine yapistir.
10. `Run` ile calistir.
11. Sol menuden `Table Editor` ac ve tablolarin geldiginı kontrol et.
12. Sol menuden `Storage` ac ve `avatars` ile `post-media` bucket'larinin olustugunu kontrol et.

## Seed Dosyasi Icin Not
`infra/supabase/seed.sql` bu fazda bilerek bos tutuldu. Demo veri gerekirse Faz 4 sonrasi uygulama uzerinden hesap acip veri uretmek daha guvenli olacaktir.

## Kontrol Listesi
- `profiles` tablosu olustu mu?
- `follows` tablosu olustu mu?
- `posts` tablosu olustu mu?
- `likes` tablosu olustu mu?
- `comments` tablosu olustu mu?
- `messages` tablosu olustu mu?
- `avatars` bucket'i olustu mu?
- `post-media` bucket'i olustu mu?

## Bana Geri Donus Formati
Manuel uygulamayi yaptiktan sonra bana su sekilde yazman yeterli:

```text
0001 migration: basarili / hatali
0002 migration: basarili / hatali
Tablolar gorunuyor mu: evet / hayir
Bucketlar gorunuyor mu: evet / hayir
Varsa hata mesaji: ...
```