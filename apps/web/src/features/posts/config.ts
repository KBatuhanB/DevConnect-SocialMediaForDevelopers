export const postsFeatureConfig = {
  api: {
    createPath: "/api/posts",
    detailPath: (postId: string) => `/api/posts/${postId}`,
    byProfilePath: (profileId: string) => `/api/profiles/${profileId}/posts`,
    likesPath: (postId: string) => `/api/posts/${postId}/likes`,
    commentsPath: (postId: string) => `/api/posts/${postId}/comments`
  },
  queryKeys: {
    root: ["posts"] as const,
    byProfile: (profileId: string) => ["posts", "profile", profileId] as const,
    comments: (postId: string) => ["posts", "comments", postId] as const
  },
  limits: {
    contentMaxLength: 5000,
    mediaMaxBytes: 2_097_152,
    commentMaxLength: 1000
  },
  form: {
    postTypes: ["text", "code", "image"] as const,
    codeLanguages: ["typescript", "javascript", "tsx", "jsx", "python", "sql", "json", "bash"] as const,
    contentPlaceholder: "Ne paylaşmak istiyorsun?",
    codePlaceholder: "Kısa, anlaşılır ve güvenli bir kod parçası paylaş.",
    imagePlaceholder: "Görsel için kısa bir açıklama ekleyebilirsin.",
    mediaAccept: "image/png,image/jpeg,image/webp"
  },
  messages: {
    createSuccess: "Paylaşım oluşturuldu.",
    deleteSuccess: "Paylaşım silindi.",
    likeSuccess: "Paylaşım beğenildi.",
    unlikeSuccess: "Beğeni kaldırıldı.",
    commentSuccess: "Yorum gönderildi.",
    mediaHint: "PNG, JPG veya WEBP. Üst limit 2 MB.",
    emptyTitle: "Paylaşım vitrini hazır",
    emptyDescription: "İlk gönderini paylaştığında bu alan profilinin canlı vitrini gibi dolmaya başlayacak.",
    profileEmptyDescription: "Bu profilde henüz yayında bir gönderi yok. Yeni paylaşımlar burada sıralanacak.",
    loadError: "Paylaşım listesi şu an okunmuyor.",
    commentsLoadError: "Yorumlar şu an okunmuyor.",
    emptyComments: "Henüz yorum yok. İlk yorumu sen yaz.",
    imageCaptionHint: "Görsel postta açıklama opsiyoneldir.",
    dashboardNote: "Faz 8 ile metin, kod ve görsel odaklı post akışı çalışır hale geldi.",
    profilePostsTitle: "Paylaşım listesi",
    dashboardPostsTitle: "Son paylaşımlar"
  }
} as const;