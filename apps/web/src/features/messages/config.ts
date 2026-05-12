export const messagesFeatureConfig = {
  paths: {
    main: "/messages",
    detail: (profileId: string) => `/messages?profileId=${profileId}`
  },
  queryParams: {
    partnerId: "profileId"
  },
  api: {
    realtimeAuthPath: "/api/messages/realtime-auth",
    listPath: "/api/messages",
    historyPath: (partnerId: string) => `/api/messages/conversations/${partnerId}`,
    readPath: (partnerId: string) => `/api/messages/conversations/${partnerId}/read`
  },
  queryKeys: {
    root: ["messages"] as const,
    realtimeAuth: ["messages", "realtime-auth"] as const,
    conversations: ["messages", "conversations"] as const,
    history: (partnerId: string) => ["messages", "history", partnerId] as const
  },
  pagination: {
    historyPageSize: 30,
    reconnectBackoffMs: [1000, 2000, 4000, 8000] as const,
    maxReconnectAttempts: 5
  },
  composer: {
    maxLength: 5000,
    placeholder: "Mesajini yaz. Kisa, net ve teknik kal."
  },
  messages: {
    title: "Direkt mesajlar",
    listTitle: "Konusmalar",
    emptyListTitle: "Henuz bir konusma yok",
    emptyListDescription: "Profillerden yeni bir DM baslatabilir veya gelen mesajlari burada takip edebilirsin.",
    emptyThreadTitle: "Bir konusma sec",
    emptyThreadDescription: "Soldan bir konusma sec veya profilden yeni bir DM baslat.",
    emptyHistoryTitle: "Bu konusma yeni basliyor",
    emptyHistoryDescription: "Ilk mesaji gondererek akisi acabilirsin.",
    listLoadError: "Konusma listesi su an okunamiyor.",
    historyLoadError: "Mesaj gecmisi su an okunamiyor.",
    loadOlder: "Daha eski mesajlari getir",
    loadingOlder: "Eski mesajlar yukleniyor...",
    sendButton: "Gonder",
    retryButton: "Tekrar dene",
    sending: "Gonderiliyor",
    sent: "Gonderildi",
    read: "Okundu",
    failed: "Hata",
    connectionConnected: "Canli baglanti hazir",
    connectionConnecting: "Canli baglanti kuruluyor",
    connectionReconnecting: "Canli baglanti tekrar deneniyor",
    connectionOffline: "Canli baglanti su an kapali",
    realtimeUnavailable: "Supabase realtime ayarlari eksik oldugu icin canli iletim kapali.",
    profileLink: "Profili ac"
  }
} as const;