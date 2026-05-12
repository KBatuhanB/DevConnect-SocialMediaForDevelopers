# Sahiplik ve Izlenebilirlik

## Amac
Bu belge, hangi modulun hangi ekip uyesine ait oldugunu ve verinin kim tarafindan sahiplenildigini netlestirir.

## Modul Sahipligi
| Modul | Ana Sahip | Yedek Sahip | Not |
| --- | --- | --- | --- |
| Auth | Berkay | Batuhan | Guvenlik kararlarinda capraz inceleme zorunlu |
| Profil ve Takip | Berkay | Batuhan | Follow veri tutarliligi kritik |
| Icerik ve Feed | Batuhan | Berkay | Feed performansi kritik |
| Medya ve Etkilesim | Batuhan | Berkay | Upload sinirlari config ile yonetilir |
| Mesajlasma | Berat | Batuhan | Realtime dayaniklilik kritik |
| Ortak Altyapi | Tum ekip | Berkay | CI ve loglama ortak sahiplikte |

## Veri Sahipligi
| Veri Alani | Kaynak | Sorumlu Modul |
| --- | --- | --- |
| Kullanici kimligi | `auth.users` | Auth |
| Profil verisi | `public.profiles` | Profil ve Takip |
| Takip iliskisi | `follows` | Profil ve Takip |
| Post verisi | `posts` | Icerik ve Feed |
| Like ve yorum | `likes`, `comments` | Medya ve Etkilesim |
| Mesaj verisi | `messages` | Mesajlasma |

## API Sahipligi
| Endpoint Alani | Ana Sahip | Not |
| --- | --- | --- |
| `/auth/*` | Berkay | Kamu uclar ve korunan auth akislari |
| `/users/*`, `/follows/*` | Berkay | Profil ve ag akisi |
| `/posts/*`, `/feed/*` | Batuhan | Icerik ve feed |
| `/posts/:id/like`, `/posts/:id/comments` | Batuhan | Etkilesim katmani |
| `/messages/*` | Berat | Mesaj gecmisi ve DM |
| `/health`, `/ready` | Tum ekip | Operasyonel uclar |

## Rapor Izlenebilirligi
- SPMP etkisi olan degisiklikler surec veya sorumluluk duzeyinde not edilir.
- SRS etkisi olan degisiklikler urun davranisi duzeyinde not edilir.
- SDD etkisi olan degisiklikler mimari ve veri modeli duzeyinde not edilir.
- Her kritik teknik karar ilgili ADR dosyasina baglanir.

## Faz 1 Maddeleri ile Eslestirme
- F1-01 ile F1-03: `system-topology.md`
- F1-04 ile F1-08: `adrs/ADR-003`, `adrs/ADR-004`, `adrs/ADR-005`
- F1-09 ile F1-14: `data-flow-and-integrations.md`
- F1-15 ile F1-21: `operations-and-secrets.md`
- F1-18 ile F1-20 ve F1-26: `module-boundaries-and-folder-contract.md` ve bu belge
- F1-27 ile F1-28: bu belge ve `system-topology.md`

## Faz 2'ye Girdi Notu
Faz 2'de kod klasorleri acilirken bu sahiplik haritasi referans alinacaktir.