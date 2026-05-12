# Teslim Sertifikasyonu ve Final Checklist

## Amac
Bu belge, proje paketinin eksiksiz teslim edilmesi ve savunma gununde hangi kontrol adimlarinin kapanmis sayilacagini yazar.

## Zorunlu Komutlar
- `npm run check`
- `npm run test:phase12`
- `npm run check:delivery`
- Canli URL varsa `npm run smoke:ops -- --web-url <url> --api-url <url>`

## Teslim Paketinde Beklenen Ana Dosyalar
- `README.md`
- `plan.md`
- `Muhteris_SRS.pdf`
- `Muhteris_SDD.pdf`
- `Muhteris_SPMP.pdf`
- `docs/phase-13/*`
- `docs/phase-14/*`
- `render.yaml`
- `apps/api/.env.production.example`
- `apps/web/.env.production.example`

## Repo Temizligi Notu
- Kaynak kod, dokuman ve kok rapor PDF'leri teslim paketinde kalir.
- `node_modules`, `.next`, `dist`, `playwright-report` ve `test-results` zorunlu teslim parcasi degildir.
- Gerekirse smoke kaniti icin `playwright-report` ayri kanit klasoru olarak paylasilabilir.

## Ekip Katki Dagilimi
- Berkay: Auth, profil, follow ve yetki kararlarinin ana sahibi
- Batuhan: Post, feed, medya ve genel UI akislarinin ana sahibi
- Berat: DM, reconnect yaklasimi ve yuk/test backlog alaninin ana sahibi
- Ortak alanlar: CI, dokumantasyon, entegrasyon, faz kapanislari

## Canli Link ve Yedek Link Kontrolu
- Web URL: teslim oncesi elle teyit edilir
- API URL: teslim oncesi elle teyit edilir
- Yedek akis: local veya preview URL + ops smoke komutu

## Final Toplanti Kontrolu
- Faz 14 belgeleri acilip hizli kontrol edildi mi?
- README ile gercek komutlar uyusuyor mu?
- Demo akisi prova edildi mi?
- Bilinen sinirlar ve backlog maddeleri acikca yazildi mi?
- Kullanicinin yapmasi gereken son platform adimlari ayrica not edildi mi?

## Kullaniciya Kalan Son Adimlar
- Gercek demo hesaplarini olusturmak
- Canli veya preview URL'leri dogrulamak
- Son kez ops smoke komutunu calistirmak
- Teslim gunu kullanacagin tarayici oturumlarini hazir tutmak