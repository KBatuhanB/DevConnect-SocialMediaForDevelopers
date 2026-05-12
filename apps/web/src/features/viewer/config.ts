export const viewerFeatureConfig = {
  api: {
    mePath: "/api/me"
  },
  queryKeys: {
    me: ["viewer", "me"] as const
  },
  emptyState: {
    title: "Profil kartin henuz dolmadi",
    description: "Profil akisini /profile ekraninda guncelleyebilir, dashboard uzerinden feed ve post akisina gecebilirsin."
  },
  shell: {
    title: "Kontrol merkezi",
    subtitle: "Ortak shell, veri istemcisi ve takip feed'i burada bir arada.",
    composerPlaceholder: "Burasi artik gercek post olusturma alanina donustu."
  }
} as const;