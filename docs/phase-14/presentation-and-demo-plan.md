# Sunum ve Demo Plani

## Demo Hedefi
10 dakikayi asmadan urunun cekirdek degerini ve teknik olgunlugunu gostermek.

## Demo Oncesi Hazirlik
- Web URL hazir olmali.
- API URL hazir olmali.
- Uc ornek hesap hazir olmali: `viewer`, `peer`, `stranger`.
- `viewer` profili doldurulmus olmali.
- `peer` kullanicisinin en az bir postu ve acik profil bilgisi olmali.
- `viewer` ile `peer` arasinda en az bir mesaj gecmisi olmali.

## Onerilen Demo Hesaplari

| Rol | Amac | Beklenen durum |
| --- | --- | --- |
| `viewer` | Uygulamayi gosteren ana hesap | Profilu dolu, en az bir postu var |
| `peer` | Takip ve DM hedefi | En az bir postu var, takip edilebilir |
| `stranger` | Yetki ve kapsama anlatisi | Takip ve DM disi karsilastirma hesabi |

Gercek e-posta ve sifreleri repoya yazma. Bunlari deployment platformu veya ekip notunda ayri tut.

## Ana Demo Akisi
1. `/auth` ekraninda giris akisina kisa bakis.
2. Giris sonrasi `/dashboard` ekraninda feed'i goster.
3. `/profile` ekraninda profil bilgisi ve avatar alanini goster.
4. `peer` profilinde follow akisini goster.
5. Dashboard veya profile uzerinden yeni post olustur.
6. `/messages?profileId=<peer>` ekraninda DM thread'ini goster.
7. Kapanista health, smoke ve test omurgasindan kisaca bahset.

## Kritik Ekran Listesi
- `/auth`
- `/dashboard`
- `/profile`
- `/profile/<peerId>`
- `/messages?profileId=<peerId>`
- Gerekirse `/health` ve `/ready`

## Prova Kontrolu
- Demo akisi bir kez kesintisiz prova edildi mi?
- Takip, post ve DM adimlari ayni hesaplarla calisiyor mu?
- Demo sirasinda kullanilacak tarayici sekmeleri onceden acildi mi?
- Gerekli URL ve hesap notlari ulasilabilir yerde mi?

## Yedek Akis
Canli demo bozulursa sira asagidaki gibi korunur:
1. `/health` ve `/ready` ile servislerin ayakta oldugunu goster.
2. `npm run smoke:ops -- --web-url <url> --api-url <url>` komutunu kullan.
3. `playwright-report/` icindeki son smoke kanitlarini veya test ozetini goster.
4. Ardindan Faz 14 belgeleri uzerinden mimari, test ve teslim hazirligini anlat.

## Kullaniciya Kalanlar
- Gercek demo hesaplarini sen olusturacaksin.
- Gercek demo URL'lerini sen netlestireceksin.
- Sunum gunu kullanacagin tarayici oturumlarini sen sabitleyeceksin.