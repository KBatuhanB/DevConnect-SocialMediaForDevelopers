# Faz 12 Test Stratejisi ve Kapsam

## Katmanlar
- `Vitest service testleri`
  Is kurallarini servis katmaninda hizli ve izole bicimde korur.
- `Vitest + Supertest integration testleri`
  Gercek Express app rotalarinda auth ve negatif API davranisini dogrular.
- `Playwright smoke E2E`
  Kullanici yolculuklarini tarayici seviyesinde, tekrar calistirilabilir sekilde korur.

## Config Disiplini
- Testte degisebilir sabitler `tests/config/phase-12.config.ts` dosyasina toplandi.
- Protected route listesi, auth cookie adi, smoke rotalari ve zaman asimlari buradan okunur.

## Korunan Kritik Yollar
- Auth: korumali rota yonlendirmesi, kayit, giris.
- Sosyal cekirdek: profil guncelleme, takip, post olusturma, feed goruntuleme.
- DM: mesaj gecmisi, gonderim, hata ve yeniden deneme davranisi.

## Henuz Otomasyonda Olmayanlar
- Gercek Supabase test veritabani ile entegrasyon.
- RLS politikalarinin canli SQL tabanli dogrulamasi.
- 50 kullanicilik mesajlasma yuk benzetimi.
- Tarayici matrisi icin Firefox ve WebKit taramalari.

## Neden Bu Denge Secildi?
- Mock API ile kritik UI davranisi daha hizli ve stabil korunuyor.
- Supertest katmani auth ve yetki davranisini mocksuz, gercek app boru hattinda kontrol ediyor.
- Bu iki katman birlikte, sonraki fazda daha pahali entegrasyon ve performans testlerine saglam bir taban veriyor.