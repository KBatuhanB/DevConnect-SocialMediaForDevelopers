# ADR-002 Deployment Topolojisi

## Durum
Onaylandi

## Baglam
Next.js ve Express ayni sekilde dagitilmaya zorlandiginda gereksiz teknik surtusme olusabilir.

## Karar
Web uygulamasi Vercel uzerinde, Express API Render uzerinde, veri servisleri ise Supabase uzerinde calisacaktir.

## Gerekce
- Next.js icin Vercel dogal uyumludur.
- Express icin surekli Node servisi daha duz bir cozum verir.
- Supabase, veri, auth, storage ve realtime ihtiyacini tek yerde toplar.

## Sonuclar
- Faz 2 ve Faz 13 dosyalari bu topolojiye gore hazirlanacaktir.
- Deployment kararinda yeni servis eklenmeyecektir.