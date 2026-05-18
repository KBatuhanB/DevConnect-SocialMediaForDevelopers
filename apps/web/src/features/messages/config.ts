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
    sidebar: ["messages", "sidebar"] as const,
    realtimeAuth: ["messages", "realtime-auth"] as const,
    history: (partnerId: string) => ["messages", "history", partnerId] as const
  },
  pagination: {
    historyPageSize: 30,
    reconnectBackoffMs: [1000, 2000, 4000, 8000] as const,
    maxReconnectAttempts: 5
  },
  composer: {
    maxLength: 5000,
    placeholder: "Mesaj yaz..."
  },
  messages: {
    title: "Direkt mesajlar",
    listTitle: "Mesaj kutusu",
    recentTitle: "Son konuştukların",
    followingTitle: "Takip ettiklerin",
    recentEmpty: "Henüz bir konuşman yok. Takip ettiğin bir kişiyle yeni bir DM başlatabilirsin.",
    followingEmpty: "Takip ettiğin kişiler burada listelenecek.",
    startConversation: "Mesaj göndermeye başla",
    emptyListTitle: "Henüz bir konuşma yok",
    emptyListDescription: "Profillerden yeni bir DM başlatabilir veya gelen mesajları burada takip edebilirsin.",
    emptyThreadTitle: "Bir konuşma seç",
    emptyThreadDescription: "Soldan bir konuşma seç veya profilden yeni bir DM başlat.",
    emptyHistoryTitle: "Bu konuşma yeni başlıyor",
    emptyHistoryDescription: "İlk mesajı göndererek akışı açabilirsin.",
    listLoadError: "Konuşma listesi şu an okunmuyor.",
    historyLoadError: "Mesaj geçmişi şu an okunmuyor.",
    loadOlder: "Daha eski mesajları getir",
    loadingOlder: "Eski mesajlar yükleniyor...",
    sendButton: "Gönder",
    retryButton: "Tekrar dene",
    sending: "Gönderiliyor",
    sent: "Gönderildi",
    read: "Okundu",
    failed: "Hata",
    connectionConnected: "Canlı bağlantı hazır",
    connectionConnecting: "Canlı bağlantı kuruluyor",
    connectionReconnecting: "Canlı bağlantı tekrar deneniyor",
    connectionOffline: "Canlı bağlantı şu an kapalı",
    realtimeUnavailable: "Supabase realtime ayarları eksik olduğu için canlı iletim kapalı.",
    profileLink: "Profili aç"
  }
} as const;