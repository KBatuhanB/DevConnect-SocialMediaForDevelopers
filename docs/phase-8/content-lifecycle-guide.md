# Content Lifecycle Guide

## Backend Yapisi
- `config.ts`: Post tipleri, limitler, desteklenen kod dilleri ve medya kosullari.
- `validation.ts`: `text`, `code` ve `image` post body dogrulama semalari.
- `service.ts`: Icerik normalizasyonu, medya data URL kontrolu ve sahiplik kurallari.
- `repository.ts`: Supabase post kaydi, `post-media` bucket yukleme ve cleanup mantigi.
- `routes.ts`: Create, delete ve profile-post listesi endpoint'leri.

## Frontend Yapisi
- `config.ts`: API yolları, query key'ler, metinler ve limitler.
- `validation.ts`: Composer formu ve gorsel dosya kontrolu.
- `api.ts`: Post create, delete ve profile listeleme istekleri.
- `hooks.ts`: Query/mutation katmani ve cache invalidation stratejisi.
- `components/post-composer.tsx`: Post tipi secimi, RHF formu ve anlik onizleme.
- `components/post-list-panel.tsx`: Profile gore listeleme ve owner delete akisi.

## Urun Kurallari
- Text post: Bos icerik kabul edilmez.
- Code post: Bos icerik kabul edilmez ve kod dili secimi zorunludur.
- Image post: Gorsel zorunludur, aciklama ise opsiyoneldir.
- Delete akisi sadece post sahibine aciktir.
- Create ve delete sonrasi post, profile ve viewer cache katmanlari yenilenir.