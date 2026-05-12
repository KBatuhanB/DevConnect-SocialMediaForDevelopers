# Faz 8 Manuel Kontrol Listesi

## Zorunlu mu?
Hayir. Build ve test dogrulamasi alindi. Bu adimlar ek kontrol icindir.

## Adimlar
1. Root klasorde `npm run dev` calistir.
2. `/auth` ekranindan giris yap.
3. `/dashboard` ekraninda text post olustur.
4. Ayni ekranda code post secip dil belirleyerek ikinci bir post olustur.
5. Gorsel post secip uygun dosya ile ucuncu postu olustur.
6. Her create sonrasi toast mesajini ve liste yenilenmesini kontrol et.
7. `/profile` ekranina git ve postlarin listelendiginu kontrol et.
8. Kendi postlarindan birini sil.
9. Silinen postun listeden kalktigini ve profil sayacinin guncellendigini kontrol et.
10. Baska bir kullanicinin `/profile/<uuid>` ekraninda delete butonunun gorunmedigini kontrol et.

## Beklenen Sonuc
- Metin, kod ve gorsel post akisi calisir.
- Bos veya eksik alanli postlar kabul edilmez.
- Gorsel yukleme basarisiz olursa yarim post kalmaz.
- Delete sadece post sahibinde gorunur ve calisir.