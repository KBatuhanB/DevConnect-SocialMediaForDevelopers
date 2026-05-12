# Faz 11 UI ve Toparlanma Notlari

## Ekran Yapisi
- Sol panel son konusmalari listeler.
- Sag panel aktif thread'i, gecmis yuklemeyi ve mesaj gondericiyi tasir.
- Profil detay ekranindan `/messages?profileId=...` rotasina gidilerek yeni DM baslatilabilir.

## Gecmis ve Thread Davranisi
- REST cevabi her sayfada mesajlari eski->yeni sirada verir.
- Eski sayfalar buton ile yuklenir; istemci tum sayfalari birlestirirken cift kayitlari eler.
- Tarih ayirici thread icinde gun degisince otomatik eklenir.

## Gonderim Durumlari
- Mesaj gonder butonuna basildiginda yerel kayit `sending` olarak eklenir.
- API cevabi gelince ayni kaydin optimistic kopyasi temizlenir ve kalici `sent` kaydi thread'e girer.
- Hata halinde kayit `error` durumunda kalir ve satirdan yeniden deneme yapilabilir.

## Kopma ve Yeniden Baglanma
- Kanal durum metni thread ustunde acikca gosterilir.
- Kanal hata verirse istemci sinirli sayida ustel geri cekilme ile tekrar dener.
- Kullanici isterse manuel olarak `Kanali yenile` aksiyonunu da kullanabilir.

## Mobil Davranis
- Mesajlar tek kolon akista da okunabilir kalacak sekilde stillendirildi.
- Masaustu boyutunda liste ve thread iki kolona ayrilir.