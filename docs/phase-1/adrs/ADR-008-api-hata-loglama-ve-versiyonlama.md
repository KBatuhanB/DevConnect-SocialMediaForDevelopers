# ADR-008 API Hata, Loglama ve Versiyonlama

## Durum
Onaylandi

## Baglam
Daginik hata modeli ve tutarsiz log yapisi bakimi zorlastirir. Ilk surumde API versiyonlamasi da gereksiz yere karmasiklastirilmamalidir.

## Karar
API tek tip JSON hata modeli kullanacaktir. Her istekte `requestId` tasinacaktir. Ilk surumde tek aktif API versiyonu bulunacaktir.

## Gerekce
- Istemci tarafinda hata gostermek kolaylasir.
- Hata takibi daha okunur hale gelir.
- Ilk surumde gereksiz versiyon yukunden kacinilir.

## Sonuclar
- Faz 5 backend ortak katmani bu karar uzerinden kurulacaktir.
- Faz 12 ve Faz 13 log ve smoke testleri bu standartlara gore yapilacaktir.