export const designSystemConfig = {
  shell: {
    title: "DevConnect Studio",
    subtitle: "Ortak shell artik profil, feed ve birebir mesajlasma akislariyla gercek urun davranisi tasiyor.",
    navigation: [
      {
        href: "/dashboard",
        label: "Kontrol merkezi",
        description: "Profil, veri ve yukleme kabuklari"
      },
      {
        href: "/messages",
        label: "Mesajlar",
        description: "Konusma listesi, gecmis ve canli iletim"
      },
      {
        href: "/profile",
        label: "Profil alani",
        description: "Biyografi, etiket, avatar ve takip durumu"
      }
    ],
    quickNotes: [
      "Formlar React Hook Form ve Zod ile ayni kaliba baglandi.",
      "Veri erisimi tek API istemcisi ve query key stratejisi uzerinden yurutuluyor.",
      "Korunan alan hem middleware hem server layout seviyesiyle korunuyor.",
      "Profil mutasyonlari viewer ve profile cache katmanlarini birlikte yeniliyor.",
      "Mesajlasma tarafinda REST gecmisi ve Supabase Realtime kanali ayni thread uzerinde bulusuyor."
    ]
  },
  feedback: {
    toastDurationMs: 3200,
    skeletonRows: 3
  },
  placeholders: {
    codeLanguage: "typescript",
    codeSample: [
      "export async function loadProfile() {",
      "  const response = await apiRequest('/api/me');",
      "  return response.profile;",
      "}"
    ].join("\n"),
    mediaHint: "Faz 10'da gercek yukleme akisi buna baglanacak.",
    viewerBioFallback: "Biyografi henuz doldurulmadi."
  },
  accessibility: {
    skipLinkText: "Icerige gec"
  }
} as const;