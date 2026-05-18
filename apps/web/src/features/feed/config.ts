export const feedFeatureConfig = {
  api: {
    mainPath: "/api/feed"
  },
  queryKeys: {
    root: ["feed"] as const,
    main: (mode: "following" | "global") => ["feed", "main", mode] as const
  },
  pagination: {
    pageSize: 20,
    preloadRootMargin: "320px 0px",
    threshold: 0.15,
    skeletonCount: 3
  },
  modes: {
    following: {
      emptyTitle: "Takip akışını kur",
      emptyDescription: "Takip ettiğin geliştiricilerin yeni paylaşımları burada akacak. Başlamak için profilden ilk bağlantılarını ekleyebilirsin."
    },
    global: {
      emptyTitle: "Ortak akış beklemede",
      emptyDescription: "Topluluktaki güncel paylaşımlar burada akacak. Yeni bir gönderiyle akışı sen başlatabilirsin."
    }
  },
  messages: {
    loadError: "Feed verisi şu an okunmuyor.",
    loadingMore: "Daha fazla içerik yükleniyor...",
    endReached: "Şimdilik bu kadar. Yeni içerik geldiğinde burada göreceksin.",
    interactionPlaceholder: "Etkileşim sayıları Faz 10 ile gelecek."
  }
} as const;