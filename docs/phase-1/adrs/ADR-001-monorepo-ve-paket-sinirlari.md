# ADR-001 Monorepo ve Paket Sinirlari

## Durum
Onaylandi

## Baglam
Proje hem web hem API hem de ortak tipler icerdigi icin klasor yapisinin en basta netlesmesi gerekir.

## Karar
Kod tabani monorepo olarak kurulacaktir. Kokte `apps`, `packages`, `infra` ve `docs` klasorleri bulunacaktir.

## Gerekce
- Tek repoda izlemek daha kolaydir.
- Ders projesi icin gereksiz daginiklik olusmaz.
- Ortak tipler tek yerde tutulabilir.

## Sonuclar
- Faz 2'de repo iskeleti bu karara gore kurulacaktir.
- Her ana kod grubunda `config` dosyasi zorunlu tutulacaktir.