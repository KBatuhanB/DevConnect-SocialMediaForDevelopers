# Frontend Foundation Guide

## Route Yapisi
- Kamu ekranlari `app/(public)` altinda tutulur.
- Korumali ekranlar `app/(protected)` altinda tutulur.
- URL sade kalir, ama kod tarafinda route gruplari amaci netlestirir.

## Provider Yapisi
- Root layout icinde `AppProviders` calisir.
- Bu provider su an iki temel altyapiyi baglar:
  - TanStack Query istemcisi
  - Toast geri bildirim sistemi

## UI Kit Kurali
- Ortak bilesenler `components/ui` altinda kalir.
- Bilesenler ince tutulur.
- Gorunus kararlarini class ve token seviyesi tasir, is kurali tasimaz.

## App Shell Kurali
- Korumali layout `AppFrame` uzerinden cizilir.
- Header, yan navigasyon ve yardim dialog'u bu kabukta toplanir.
- Faz 7 ve sonrasi ekranlar sadece shell icerigini doldurur.

## Tasarim Tokenlari
- Renk, tipografi, radius ve golge kararlari `globals.css` icindeki CSS variable katmaninda toplandi.
- Display font ve body font root layout seviyesinde tanimlandi.

## Durum Desenleri
- Loading: `Skeleton`
- Bos durum: `EmptyState`
- Hata: `app/error.tsx`
- Bildirim: `ToastProvider`

## Erişilebilirlik Notu
- Skip link eklendi.
- Focus-visible durumu ortak buton ve input katmaninda tanimli.
- Korumali shell ve form alanlari klavye ile dolasilabilir durumda.