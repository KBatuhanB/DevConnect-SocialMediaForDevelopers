# ADR-007 Config ve Secret Yonetimi

## Durum
Onaylandi

## Baglam
Tahtada veya demo sirasinda hizli degisiklik ihtimali vardir. Degisebilir degerlerin koda dagilmasi projeye hakimiyeti dusurur.

## Karar
Her ana kod grubu kendi `config` dosyasina sahip olacaktir. Secret degerler ise merkezi environment katmanindan yonetilecektir. Modul config dosyalari okunur, kisa ve degistirilebilir tutulacaktir.

## Gerekce
- Deger degistirmek kolaylasir.
- Hard-coded degerler azalir.
- Kodun anlatilabilirligi artar.

## Sonuclar
- Faz 2 repo iskeletinde `config.ts` dosyalari varsayilan gelecek.
- Faz 4, Faz 9, Faz 10 ve Faz 11 gibi modullerde esikler config altinda toplanacaktir.