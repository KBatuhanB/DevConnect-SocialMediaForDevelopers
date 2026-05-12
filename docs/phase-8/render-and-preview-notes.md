# Render and Preview Notes

## Neden Hafif Yontem Secildi?
- Faz 8'de amac agir editor veya highlight kutuphanesi eklemek degildi.
- Ilk surum icin sade textarea, secici ve `pre/code` onizleme yeterli kabul edildi.

## Guvenlik Notu
- Post icerigi HTML olarak render edilmiyor.
- API tarafinda icerik temel kontrol karakterlerinden temizlenip duz metin/kod olarak tasiniyor.
- UI tarafinda icerik React'in varsayilan escape davranisi ile plain text olarak gosteriliyor.

## Gorsel Akisi
- Gorsel secimi istemcide tip ve boyut kontrolunden geciyor.
- API ayni kontrolu tekrar yapiyor.
- Yukleme basarisiz olursa yarim post olusmuyor.

## Bilerek Ertelenenler
- Gercek syntax highlight zenginlestirmesi.
- Taslak kaydetme.
- Feed invalidation yerine feed sorgusu Faz 9'da netlestirilecek.