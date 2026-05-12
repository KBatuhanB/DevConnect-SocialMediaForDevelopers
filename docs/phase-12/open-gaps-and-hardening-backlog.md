# Faz 12 Acik Kalan Sertlestirme Notlari

## Henuz Bu Workspace'te Otomasyona Alinmayanlar
- Supabase test veritabani ile migration tabanli entegrasyon akisi.
- RLS politikalarinin SQL seviyesinde negatif/pozitif dogrulamasi.
- Feed sorgusu icin canli veriyle performans olcumu.
- DM icin 50 eszamanli kullanici yuk benzetimi.
- Firefox ve WebKit tarayici matrisi.

## Dikkat Ceken Uyum Notu
- Faz 12 planinda gecen like ve yorum E2E maddeleri bu workspace'te otomasyona alinmadi.
- Sebep, mevcut kod tabaninda like/comment is modulu veya UI yuzeyi bulunmamasi.
- Bu yuzey eklenirse ayni smoke omurgasina yeni senaryo dosyasi baglamak yeterli olacak.

## Onerilen Sonraki Adimlar
1. Supabase test projesi veya izole test schema'si ac.
2. RLS ve feed/DM performans testlerini oraya bagla.
3. Playwright matrisine Firefox ekle.
4. Canli smoke kanitlari icin ekran goruntusu ve not toplama akisini standartlastir.