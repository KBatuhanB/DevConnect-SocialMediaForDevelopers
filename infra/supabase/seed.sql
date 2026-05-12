-- Bu dosya demo veri stratejisini sade tutmak icin bos birakildi.
-- Faz 4 ile auth akisi gerceklestiginde demo kullanicilari uygulama uzerinden olusturmak daha guvenli olacak.
-- Yine de ornek veri gerektiginde su sira izlenecek:
-- 1. Uygulama veya Supabase Auth uzerinden demo kullanicilarini olustur.
-- 2. Profil trigger'inin `public.profiles` satirlarini actigini dogrula.
-- 3. Sonra follows, posts, likes, comments ve messages icin kontrollu insert calistir.

begin;

-- Faz 3'te seed stratejisi kayda gecirildi ama gercek demo veri insertleri bilerek eklenmedi.

commit;