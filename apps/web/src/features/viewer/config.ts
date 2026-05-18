export const viewerFeatureConfig = {
  api: {
    mePath: "/api/me"
  },
  queryKeys: {
    me: ["viewer", "me"] as const
  },
  emptyState: {
    title: "Profil kartin henuz dolmadi",
    description: "Profil akışını /profile ekranında güncelleyebilir, dashboard üzerinden feed ve post akışına geçebilirsin."
  },
  shell: {
    title: "Kontrol merkezi",
    subtitle: "Ortak shell, veri istemcisi ve takip feed'i burada bir arada.",
    composerPlaceholder: "Burası artık gerçek post oluşturma alanına dönüştü."
  }
} as const;