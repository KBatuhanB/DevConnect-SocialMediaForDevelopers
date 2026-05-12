# Rapor Uyum ve Sapma Notlari

## Amac
Bu belge, kokteki `Muhteris_SRS.pdf`, `Muhteris_SDD.pdf` ve `Muhteris_SPMP.pdf` ile gercek uygulama arasindaki farklari gizlemeden ozetler.

## SDD ile Uyum ve Duzeltmeler

| Konu | Rapordan cikan beklenti | Gercek uygulama | Durum |
| --- | --- | --- | --- |
| Kullanici modeli | Tek `users` varligi dusunulebilir | Supabase ile uyumlu bicimde `auth.users` + `public.profiles` ayrimi kullanildi | Bilincli mimari duzeltme |
| Frontend yapisi | Saf SPA yorumu cikabilir | Next.js App Router ile hibrit server/client yapi kuruldu | Bilincli mimari duzeltme |
| Deployment | Web ve API ayni yuzeyde dusunulebilir | Web Vercel, API Render, veri Supabase topolojisi benimsendi | Faz 1 ADR ile sabitlendi |
| Veri kaynagi | Coklu veritabani yorumu cikabilir | Ilk surumde tek veri kaynagi olarak Supabase PostgreSQL kullanildi | Sadelestirme karari |
| Realtime | Chat icin genel canli iletim beklentisi | Ek socket sunucusu yerine Supabase Realtime ve korumali realtime auth kullanildi | Uygulandi |
| Config disiplini | Raporlarda daginik kalabilir | Her ana modulde `config.ts` zorunlu hale getirildi | Sunum kolayligi icin guclendirildi |

## SRS ile Gercek Kapsam Uyum Durumu

### Teslime Giren Cekirdek Kapsam
- Cookie tabanli auth ve korumali rota yapisi
- Profil, avatar ve follow akislari
- Post olusturma, profil listeleme ve feed deneyimi
- Birebir mesajlasma, retry ve realtime toparlama davranisi
- Test, smoke, deploy ve rollback omurgasi

### Bilerek Ertelenen veya Kismi Kalanlar
- Like ve comment modulu icin isleyen API/UI yuzeyi bu workspace'te yok.
- Canli SQL tabanli RLS otomasyonu yok.
- 50 kullanicilik DM yuk benzetimi yok.
- Firefox ve WebKit tarayici matrisi yok.

Bu farklar urunun cekirdek demo ve teknik savunma hedefini bozmaz, ancak teslim sirasinda acikca soylenmelidir.

## SPMP ile Fiili Plan Sapmasi
- Planlanan kalite hedefleri korunarak Faz 12 ve Faz 13 beklenenden daha agir bir test ve operasyon omurgasi ile kapatildi.
- Sunum aninda hizli degisiklik yapilabilmesi icin `config` disiplini, ilk raporlardan daha sert bir ekip kurali haline getirildi.
- Like/comment ve canli yuk testi, eldeki workspace siniri nedeniyle Faz 14 teslim paketine alinmadi; bunlar sonraki surum backlog'u olarak tutuldu.

## Sonuc
Raporlarla uygulama arasinda gizlenen bir yon degil, kontrollu bir sadelestirme ve mimari netlestirme vardir. Faz 14 teslimi bu farklari acikca anlattigi icin savunulabilir durumdadir.