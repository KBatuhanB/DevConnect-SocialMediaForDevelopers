# Faz 6 Ozeti

## Hedef
Faz 6'nin amaci, urun ekranlarinin ustune kurulacagi ortak on yuz omurgasini, tasarim tokenlarini, veri istemci modelini ve durum desenlerini netlestirmektir.

## Tamamlanan Isler
- Next.js App Router yapisi kamu ve korunan rota gruplari ile ayrildi.
- Root layout icine query ve toast provider'lari eklendi.
- Global loading, error ve not-found ekranlari olusturuldu.
- Ortak UI kit icin button, input, textarea, dialog, card, skeleton ve empty-state bilesenleri eklendi.
- Auth formu React Hook Form + Zod + TanStack Query kalibina tasindi.
- Korumali dashboard shell'i ve mobil uyumlu yan navigasyon eklendi.
- `viewer` verisi icin merkezi API client ve query hook kalibi olusturuldu.
- Kod onizleme ve medya yukleme kabuk bilesenleri ilk surum icin hazirlandi.

## Faz 6'da Bilerek Basit Tutulanlar
- Tam tasarim sistemi dokumantasyonu yerine kisa kullanim rehberi yazildi.
- Toast sistemi hafif bir custom provider ile kuruldu; harici kutuphane eklenmedi.
- Theme switching ilk surumde acilmadi.
- Gelismis modal veya focus trap kutuphanesi eklenmeden native dialog tabani secildi.

## Ciktilar
- `apps/web/src/components/providers/*`
- `apps/web/src/components/ui/*`
- `apps/web/src/features/design-system/config.ts`
- `apps/web/src/features/auth/*`
- `apps/web/src/features/viewer/*`
- `apps/web/src/features/app-shell/components/app-frame.tsx`
- `apps/web/src/app/(public)/*`
- `apps/web/src/app/(protected)/*`

## Kullaniciya Kalanlar
- Zorunlu bir adim yok.
- Istersen auth ve dashboard akisini tarayicida elde dogrulayabilirsin.
- Bunun icin ayrintilar `manual-checklist.md` icinde yazili.

## Faz 7'ye Gecis Notu
Profil ve sosyal grafik ekranlari artik hazir bir shell, form kalibi, veri istemcisi ve korunan layout ustune insa edilebilir.