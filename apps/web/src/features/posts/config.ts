export const postsFeatureConfig = {
  api: {
    createPath: "/api/posts",
    detailPath: (postId: string) => `/api/posts/${postId}`,
    byProfilePath: (profileId: string) => `/api/profiles/${profileId}/posts`
  },
  queryKeys: {
    root: ["posts"] as const,
    byProfile: (profileId: string) => ["posts", "profile", profileId] as const
  },
  limits: {
    contentMaxLength: 5000,
    mediaMaxBytes: 2_097_152
  },
  form: {
    postTypes: ["text", "code", "image"] as const,
    codeLanguages: ["typescript", "javascript", "tsx", "jsx", "python", "sql", "json", "bash"] as const,
    contentPlaceholder: "Ne paylasmak istiyorsun?",
    codePlaceholder: "Kisa, anlasilir ve guvenli bir kod parcasi paylas.",
    imagePlaceholder: "Gorsel icin kisa bir aciklama ekleyebilirsin.",
    mediaAccept: "image/png,image/jpeg,image/webp"
  },
  messages: {
    createSuccess: "Paylasim olusturuldu.",
    deleteSuccess: "Paylasim silindi.",
    mediaHint: "PNG, JPG veya WEBP. Ust limit 2 MB.",
    emptyTitle: "Henuz paylasim yok",
    emptyDescription: "Ilk paylasimini olusturdugunda burada gosterilecek.",
    profileEmptyDescription: "Bu profil icin henuz gorunecek bir paylasim yok.",
    loadError: "Paylasim listesi su an okunamiyor.",
    imageCaptionHint: "Gorsel postta aciklama opsiyoneldir.",
    dashboardNote: "Faz 8 ile metin, kod ve gorsel odakli post akisi calisir hale geldi.",
    profilePostsTitle: "Paylasim listesi",
    dashboardPostsTitle: "Son paylasimlar"
  }
} as const;