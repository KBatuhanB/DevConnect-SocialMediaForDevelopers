# Faz 1 Ozeti

## Hedef
Faz 1'in amaci, DevConnect icin uygulanabilir sistem topolojisini, modul sinirlarini ve kritik teknik kararlari yazili ve tek anlamli hale getirmektir.

## Faz 1 Ciktilari
- `system-topology.md`
- `module-boundaries-and-folder-contract.md`
- `data-flow-and-integrations.md`
- `operations-and-secrets.md`
- `ownership-and-traceability.md`
- `adrs/ADR-001` ile `adrs/ADR-008` arasi karar kayitlari

## Faz 1'de Sabitlenen Ana Kararlar
- Web uygulamasi Next.js App Router ile hibrit calisacaktir.
- API katmani ayri bir Express servisi olarak calisacaktir.
- Web Vercel uzerinde, API Render uzerinde konumlanacaktir.
- Kimlik bilgisi `auth.users`, profil verisi `public.profiles` uzerinden ayrilacaktir.
- Ilk surumde tek veri kaynagi PostgreSQL ve tek bulut platformu Supabase olacaktir.
- Gercek zamanli iletisimde birincil cozum Supabase Realtime olacaktir.
- Her ana kod grubu kendi `config` dosyasi ile gelecektir.
- Basit kod ve kisa Turkce yorum standardi zorunlu kalacaktir.

## Faz 2'ye Gecis Notu
Faz 2 baslamadan once artik tartisilmamasi gereken alanlar:
- Monorepo kok klasorleri
- Deployment topolojisi
- Auth modeli
- Veri sahipligi ve API sahipligi
- Secret ve environment mantigi
- Config ve klasor sozlesmesi

## Senden Beklenenler
- Bu asamada zorunlu yeni karar istemiyorum.
- Faz 2 ve yerel gelistirme icin zorunlu tek dis servis erisimi Supabase tarafidir.
- GitHub remote kullanimi ve Vercel/Render deployment hazirligi proje gelisimi tamamlandiktan sonra yapilabilir.
- Mumkunse Supabase `Project URL` bilgisini metin olarak paylasman yeterlidir.
- Supabase `service_role` anahtarini ve database sifresini paylasmaman gerekir.

## Faz 1 Tamamlanma Kosulu
Bu klasordeki belgeler ve ADR dosyalari birlikte okundugunda Faz 2 repo kurulumuna tartismasiz girilebilmelidir.