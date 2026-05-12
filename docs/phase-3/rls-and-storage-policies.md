# RLS ve Storage Politikasi

## RLS Yaklasimi
- Varsayilan mantik, yazma islemlerini sahiplik uzerinden sinirlamaktir.
- Okuma politikasi, urunun sosyal ag dogasina uygun olarak public verilerde daha aciktir.
- Mesajlar, en dar erisim kuralina sahip tablodur.

## Tablo Bazli Politika Ozeti

### `profiles`
- Authenticated kullanici tum profilleri okuyabilir.
- Kullanici sadece kendi profilini ekleyebilir veya guncelleyebilir.

### `follows`
- Authenticated kullanici takip iliskilerini okuyabilir.
- Insert ve delete sadece `follower_id = auth.uid()` icin serbesttir.

### `posts`
- Authenticated kullanici postlari okuyabilir.
- Kullanici sadece kendi postunu ekler, gunceller veya siler.

### `likes`
- Authenticated kullanici like kayitlarini okuyabilir.
- Kullanici sadece kendi hesabindan like ekler veya siler.

### `comments`
- Authenticated kullanici yorumlari okuyabilir.
- Kullanici sadece kendi yorumunu ekler veya siler.

### `messages`
- Kullanici sadece tarafi oldugu mesajlari okuyabilir.
- Kullanici sadece kendi hesabindan mesaj gonderebilir.
- Alici tarafi `is_read` benzeri guncellemeleri yapabilir.

## Storage Politikasi

### `avatars`
- Herkes okuyabilir.
- Kullanici sadece kendi klasorune yukleme yapabilir.
- Kullanici sadece kendi avatar nesnelerini gunceller veya siler.

### `post-media`
- Herkes okuyabilir.
- Kullanici sadece kendi klasorune medya yukler.
- Kullanici sadece kendi medya nesnelerini gunceller veya siler.

## Kritik Guvenlik Notu
- `service_role` ile dogrudan istemci is akisi kurulmaz.
- Supabase URL public olabilir ama secret anahtarlar asla repoya yazilmaz.
- Bu fazda secret'lar sadece yerel `.env.local` dosyasina yerlestirildi.