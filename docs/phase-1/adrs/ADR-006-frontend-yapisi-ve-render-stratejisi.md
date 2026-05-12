# ADR-006 Frontend Yapisi ve Render Stratejisi

## Durum
Onaylandi

## Baglam
Uygulama tamamen client tarafa itilirse auth ve ilk yukleme akislari zayiflayabilir. Tam server agirlikli kurgu da gereksiz olur.

## Karar
Next.js App Router ile hibrit bir yapi kurulacaktir. Ilk yukleme ve route koruma icin server destekli akislardan, etkilesimli ekranlarda ise client agirlikli yaklasimdan yararlanilacaktir.

## Gerekce
- Next.js yetenekleri dengeli kullanilir.
- Auth akislari daha kontrollu olur.
- UI performansi ve gelistirme hizi dengelenir.

## Sonuclar
- Faz 6 web shell bu stratejiye gore kurulacaktir.
- Feed, profil ve DM gibi ekranlarda gerektigi kadar client state kullanilacaktir.