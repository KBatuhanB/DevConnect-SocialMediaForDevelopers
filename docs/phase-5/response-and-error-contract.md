# Response ve Error Contract

## Basari Sozlesmesi
Tum basarili cevaplar ayni govdeyi kullanir:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "..."
  }
}
```

## Hata Sozlesmesi
Tum hatali cevaplar ayni govdeyi kullanir:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "...",
    "requestId": "..."
  }
}
```

## Cekirdek Hata Kodlari
- `INTERNAL_ERROR`: Beklenmeyen sunucu hatasi.
- `NOT_FOUND`: Tanimli olmayan endpoint.
- `VALIDATION_FAILED`: Genel girdi dogrulama hatasi.
- `AUTH_REQUIRED`: Korumali kaynak icin oturum gerekir.
- `AUTH_VALIDATION_FAILED`: Auth body dogrulamasi basarisiz.

## Modul Seviyesi Kodlar
- `AUTH_LOGIN_FAILED`
- `AUTH_REGISTER_FAILED`
- `AUTH_RATE_LIMIT`
- `VIEWER_PROFILE_READ_FAILED`
- `VIEWER_PROFILE_NOT_FOUND`

## Neden Tek Tip?
- Frontend hata ayiklama kolaylasir.
- Log ile istemci cevabi ayni request id uzerinden eslesir.
- Yeni moduller farkli cevap govdesi uretmez.