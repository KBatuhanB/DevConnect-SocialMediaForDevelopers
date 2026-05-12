# Feed UI and Infinite Scroll

## Feed Karti
- Feed karti author avatar veya initial, kullanici adi, tarih, post tipi ve icerigi gosterir.
- Kod postlari hafif `pre/code` blokla render edilir.
- Gorsel postlar mevcut medya onizleme stiliyle gosterilir.
- Kart altinda etkileşim alaninin Faz 10 ile gelecegini belirten sabit metin bulunur.

## Dashboard Akisi
- Dashboard ustte profil ozeti ve composer ile kalir.
- Alt bolumde profile ozel liste yerine artik gercek feed gosterilir.
- Kullanici kendi postlarini feed icinde gorebilir.

## Sonsuz Kaydirma
- `useInfiniteQuery` ana veri kaynagidir.
- En altta gorunmez sentinel yerine metin tasiyan bir observer hedefi kullanilir.
- Sentinel gorunur oldugunda ve aktif istek yoksa bir sonraki sayfa cekilir.
- Fazla istek uretmemek icin `hasNextPage` ve `isFetchingNextPage` korumalari kullanilir.

## Bos ve Hata Durumlari
- Feed bos ise kullaniciya takip veya paylasim uretimi icin yonlendirici metin gosterilir.
- Hata durumunda yeniden dene butonu vardir.
- Ilk yuklemede skeleton kartlari gosterilir.