# Operasyonlar ve Secret Yonetimi

## Amac
Bu belge, Faz 2'de environment, secret, log ve operasyon katmaninin nasil kurulacagini sabitler.

## Environment Stratejisi
- Environment degerleri development, test ve production olarak ayrilir.
- Secret degerler kod icinde tutulmaz.
- Secret degerler yalnizca deployment platformlarinin guvenli ayar alaninda saklanir.
- Modul config dosyalari secret okumaz; merkezi environment katmanindan beslenir.

## Erisim Zamanlamasi
- Yerel gelistirme ve Faz 2 kurulumu icin zorunlu olan tek dis servis Supabase erisimidir.
- GitHub remote baglantisi proje ilerlerken bekleyebilir; ilk asamada lokal repo ile calisilabilir.
- Vercel ve Render erisimi deployment asamasina kadar zorunlu degildir.
- Bu tercih mimari karari degistirmez; yalnizca entegrasyon zamanlamasini erteler.

## Secret Siniflari

### Public Degerler
- Web tarafinda kullanilabilen, hassas olmayan URL ve genel kimlikler
- Supabase `Project URL`
- Gerekli oldugunda istemci tarafinda kullanilacak public `anon` anahtari

### Server Secret Degerler
- Service role anahtari
- Ozel API secret'lari
- Yedek veya operasyon anahtarlari
- Database sifresi

## Service Role Kullanimi
- Yalnizca sunucu tarafinda kullanilir.
- Istemci bundle'ina hicbir sekilde girmez.
- Sadece zorunlu akislarda kullanilir.
- Kullanilan yerler kod ve dokumantasyonda acikca isaretlenir.

## API Versiyonlama Karari
- Ilk surumde tek aktif API versiyonu kullanilacaktir.
- Rota tabaninda `v1` kullanimi desteklenebilir ama gereksiz versiyon sayisi acilmayacaktir.
- Kural basittir: ilk surumde tek versiyon, sonraki kirici degisiklikte yeni versiyon.

## Loglama Standardi
- Yapilandirilmis log formati kullanilacaktir.
- Her istekte `requestId` tasinacaktir.
- Loglarda sifre, token ve hassas veri olmayacaktir.
- Hatalar gelistirme ve production ortaminda farkli ayrinti duzeyinde yazilacaktir.

## Health ve Operasyon Uclari
- `GET /health`: servis ayakta mi kontrolu
- `GET /ready`: bagimliliklar hazir mi kontrolu

Bu iki uc sade tutulur. Ilk surumde asiri operasyon kurgusu kurulmaz.

## Migration ve Rollback Yaklasimi
- Migration dosyalari sira ile calisir.
- Uretim oncesi yedekleme dusunulur.
- Rollback karari elle ama yazili adimlarla uygulanir.
- Migration'lar denetlenmeden uretime cikarilmaz.

## Sunum ve Tahta Icin Hazirlik Notu
- Kritik esikler config dosyalarinda oldugu icin limit degisikligi kod taramasi gerektirmeyecektir.
- Ortam degerleri ve secret'lar ayrildigi icin gosterim sirasinda daha kontrollu degisiklik yapilabilir.