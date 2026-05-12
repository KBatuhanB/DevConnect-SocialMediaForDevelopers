# Veri Akislari ve Entegrasyonlar

## Amac
Bu belge, kritik kullanici akislarinda verinin hangi bilesenler arasindan gececegini netlestirir.

## Auth Akisi
```mermaid
sequenceDiagram
    participant U as Kullanici
    participant W as Web
    participant S as Supabase Auth
    U->>W: Kayit veya giris formu
    W->>S: Auth istegi
    S-->>W: Oturum bilgisi
    W-->>U: Basarili giris veya hata
```

Kararlar:
- Kimlik bilgisi Supabase Auth tarafinda kalir.
- Web yalnizca gerekli oturum bilgisini kullanir.
- Korunan API uclari token dogrulamasi ile calisir.

## Profil ve Takip Akisi
```mermaid
sequenceDiagram
    participant U as Kullanici
    participant W as Web
    participant A as API
    participant D as Supabase DB
    U->>W: Profil guncelle veya takip et
    W->>A: Yetkili istek
    A->>D: Profiles veya follows islemi
    D-->>A: Sonuc
    A-->>W: Standart JSON sonuc
    W-->>U: Guncel ekran
```

Kararlar:
- Profil verisi `public.profiles` tarafinda tutulur.
- Takip iliskileri `follows` tablosunda tutulur.
- Takip sayaçlari icin gereksiz karmasiklik eklenmez; sade ve tutarli cozum hedeflenir.

## Post Olusturma ve Medya Akisi
```mermaid
sequenceDiagram
    participant U as Kullanici
    participant W as Web
    participant S as Supabase Storage
    participant A as API
    participant D as Supabase DB
    U->>W: Post formu ve gorsel secimi
    W->>W: Boyut kontrolu ve sikistirma
    W->>S: Medya yukleme
    S-->>W: Medya yolu
    W->>A: Post olusturma istegi
    A->>D: Post kaydi
    D-->>A: Basarili sonuc
    A-->>W: JSON yanit
    W-->>U: Feed guncelleme
```

Kararlar:
- Gorsel yukleme once istemci tarafinda sinirlandirilir.
- Post kaydi ile medya yolu birlikte ele alinir.
- Yarım basari hissi olusmaması hedeflenir.

## Feed Akisi
```mermaid
sequenceDiagram
    participant U as Kullanici
    participant W as Web
    participant A as API
    participant D as Supabase DB
    U->>W: Ana feed ekranini acar
    W->>A: Cursor ile feed istegi
    A->>D: Takip iliskisi odakli sorgu
    D-->>A: Post listesi
    A-->>W: JSON sonuc
    W-->>U: Feed kartlari
```

Kararlar:
- Feed yalnizca takip edilen hesaplara gore uretilir.
- Cursor pagination zorunludur.
- Feed karti basit ve tekrar kullanilabilir kalir.

## DM Akisi
```mermaid
sequenceDiagram
    participant U as Kullanici
    participant W as Web
    participant R as Supabase Realtime
    participant A as API
    participant D as Supabase DB
    U->>W: Sohbet ekranini acar
    W->>A: Gecmis mesajlari ister
    A->>D: Mesaj gecmisi sorgusu
    D-->>A: Gecmis mesajlar
    A-->>W: Gecmis mesajlar
    W->>R: Realtime kanala baglanir
    U->>W: Yeni mesaj gonderir
    W->>A: Mesaji kaydet
    A->>D: Mesaj kaydi
    D-->>A: Sonuc
    A-->>W: Kayit sonucu
    R-->>W: Yeni mesaj olayi
```

Kararlar:
- Gecmis mesaj API ile, anlik mesaj Realtime ile desteklenir.
- Supabase Realtime ilk surumde yeterli kabul edilir.
- Socket.IO ilk surumde devreye alinmaz.

## Hata Yaniti Sozlesmesi
Tum API hatalari tek tip JSON modelini kullanir:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Gecerli bir istek gonderin.",
    "requestId": "..."
  }
}
```

Bu model, istemci tarafinda sade ve tek tip hata gostermeyi kolaylastirir.