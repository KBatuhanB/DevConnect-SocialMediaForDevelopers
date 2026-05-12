# ADR-003 Auth ve Kimlik Modeli

## Durum
Onaylandi

## Baglam
Raporlarda mantiksal `users` varligi vardir, ancak Supabase Auth ile profil verisini ayni yere koymak saglikli degildir.

## Karar
Kimlik bilgisi `auth.users` tarafinda, profil verisi `public.profiles` tarafinda tutulacaktir. Korunan API uclari Supabase tabanli token dogrulama ile calisacaktir.

## Gerekce
- Auth ile profil verisini ayirmak daha guvenlidir.
- Veri sahipligi daha nettir.
- Profil gelistirmeleri auth tablosuna zarar vermez.

## Sonuclar
- Faz 3 migration modeli bu ayrimla kurulacaktir.
- Faz 4 auth ve profil akislarinda bu ayrim korunacaktir.