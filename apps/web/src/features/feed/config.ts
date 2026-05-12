export const feedFeatureConfig = {
  api: {
    mainPath: "/api/feed"
  },
  queryKeys: {
    root: ["feed"] as const,
    main: ["feed", "main"] as const
  },
  pagination: {
    pageSize: 20,
    preloadRootMargin: "320px 0px",
    threshold: 0.15,
    skeletonCount: 3
  },
  messages: {
    title: "Takip feed'i",
    emptyTitle: "Feed henuz bos",
    emptyDescription: "Birini takip ettiginde veya kendi yeni paylasimlarini urettiginde ana akis burada gorunecek.",
    loadError: "Feed verisi su an okunamiyor.",
    loadingMore: "Daha fazla icerik yukleniyor...",
    endReached: "Simdilik bu kadar. Yeni icerik geldiginde burada goreceksin.",
    interactionPlaceholder: "Etkilesim sayilari Faz 10 ile gelecek."
  }
} as const;