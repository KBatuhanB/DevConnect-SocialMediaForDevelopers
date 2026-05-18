export const designSystemConfig = {
  shell: {
    title: "DevConnect Studio",
    subtitle: "Ortak shell artık profil, feed ve birebir mesajlaşma akışlarıyla gerçek ürün davranışı taşıyor.",
    navigation: [
      {
        href: "/dashboard",
        label: "Kontrol merkezi",
        description: "Profil, veri ve yükleme kabukları"
      },
      {
        href: "/messages",
        label: "Mesajlar",
        description: "Konuşma listesi, geçmiş ve canlı iletim"
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
      "Mesajlaşma tarafında REST geçmişi ve Supabase Realtime kanalı aynı thread üzerinde buluşuyor."
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
    mediaHint: "Faz 10'da gerçek yükleme akışı buna bağlanacak.",
    viewerBioFallback: "Biyografi henuz doldurulmadi."
  },
  accessibility: {
    skipLinkText: "Icerige gec"
  }
} as const;