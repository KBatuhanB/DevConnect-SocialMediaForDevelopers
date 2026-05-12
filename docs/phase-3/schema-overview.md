# Schema Overview

## Temel Tablolar

### `public.profiles`
- Kaynak kimlik: `auth.users.id`
- Alanlar: `username`, `bio`, `avatar_path`, `skills`, `created_at`, `updated_at`
- Not: Profil satiri auth trigger'i ile otomatik acilir.

### `public.follows`
- Amac: Takip iliskilerini tutmak
- Anahtar: `(follower_id, following_id)`
- Not: Kullanicinin kendini takip etmesi veritabani seviyesinde engellenir.

### `public.posts`
- Amac: Metin, gorsel ve kod odakli gonderileri tutmak
- Alanlar: `content`, `media_path`, `code_language`, `post_type`
- Not: `post_type` kontrolu ile hangi kombinasyonun gecerli oldugu korunur.

### `public.likes`
- Amac: Ayni kullanicinin ayni postu ikinci kez begenmesini fiziksel olarak engellemek
- Anahtar: `(post_id, user_id)`

### `public.comments`
- Amac: Post altindaki yorumlari tutmak
- Not: Bos yorum ve asiri uzun yorum veritabaninda da engellenir.

### `public.messages`
- Amac: Birebir DM gecmisi
- Alanlar: `sender_id`, `receiver_id`, `content`, `is_read`, `created_at`
- Not: Kullanici kendine mesaj gonderemez.

## Iliskiler
- `profiles.id` -> `auth.users.id`
- `follows.follower_id` -> `profiles.id`
- `follows.following_id` -> `profiles.id`
- `posts.user_id` -> `profiles.id`
- `likes.post_id` -> `posts.id`
- `likes.user_id` -> `profiles.id`
- `comments.post_id` -> `posts.id`
- `comments.user_id` -> `profiles.id`
- `messages.sender_id` -> `profiles.id`
- `messages.receiver_id` -> `profiles.id`

## Indeks Kararlari
- Feed icin `posts(user_id, created_at desc)`
- Genel post akisi icin `posts(created_at desc)`
- Yorum akisi icin `comments(post_id, created_at desc)`
- Mesaj gecmisi icin `messages(sender_id, receiver_id, created_at desc)`
- Okunmamis mesaj kontrolu icin `messages(receiver_id, is_read, created_at desc)`

## Faz 3 Tasarim Notlari
- Sayac kolonlari bu surumde eklenmedi.
- Bu karar, gereksiz trigger karmasikligini erken asamada engellemek icin alindi.
- Gerektiginde Faz 7 veya performans asamasinda sayac stratejisi tekrar degerlendirilebilir.