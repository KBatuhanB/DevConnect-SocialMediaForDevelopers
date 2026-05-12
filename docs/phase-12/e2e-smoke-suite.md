# Faz 12 E2E Smoke Suite

## Senaryolar
- `auth.spec.ts`
  Korumali rota yonlendirmesi, kayit formu ve giris akisi.
- `social-core.spec.ts`
  Profil guncelleme, takip, post olusturma ve feed goruntuleme.
- `messages.spec.ts`
  DM ekraninda hata almis gonderimin yeniden denenmesi.

## Mock API Yaklasimi
- Tarayici tarafinda `http://localhost:4000` istekleri stateful mock katmaninda karsilanir.
- Boylece testler gercek UI davranisini korurken canli Supabase bagimliligina takilmaz.
- Kritik karar burada hiz ve tekrar edilebilirliktir; daha agir entegrasyon testi ayri bir katman olarak dusunulur.

## Realtime Karari
- Smoke suite icinde DM testi bilerek `realtime-auth` hatasiyla kosar.
- Bu sayede kullanicinin kopuk kanal uyarisini gormesi ve REST tabanli mesaj gonderim/retry yolu da test edilir.

## Responsive Kapsam
- Playwright config iki proje ile calisir:
  masaustu Chromium ve mobil Chromium emulasyonu.
- Bu, Faz 12 planindaki kritik ekran responsive kontrolu icin temel bir otomasyon zemini saglar.