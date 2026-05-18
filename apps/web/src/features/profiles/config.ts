export const profileFeatureConfig = {
  paths: {
    myProfile: "/profile",
    detail: (profileId: string) => `/profile/${profileId}`
  },
  api: {
    mePath: "/api/profiles/me",
    searchPath: (query: string) => `/api/profiles/search?${new URLSearchParams({ query }).toString()}`,
    detailPath: (profileId: string) => `/api/profiles/${profileId}`,
    followPath: (profileId: string) => `/api/profiles/${profileId}/follow`,
    avatarPath: "/api/profiles/me/avatar"
  },
  queryKeys: {
    root: ["profiles"] as const,
    me: ["profiles", "me"] as const,
    search: (query: string) => ["profiles", "search", query] as const,
    detail: (profileId: string) => ["profiles", "detail", profileId] as const
  },
  form: {
    bioMaxLength: 300,
    skillMaxCount: 10,
    skillMaxLength: 24,
    skillSeparator: ",",
    bioPlaceholder: "Kısa, teknik ve net bir biyografi yaz.",
    skillsPlaceholder: "TypeScript, React, Node.js",
    avatarAccept: "image/png,image/jpeg,image/webp",
    avatarMaxBytes: 2_097_152
  },
  messages: {
    emptyBio: "Bu profilde henüz biyografi yok.",
    emptySkills: "Henüz beceri etiketi eklenmedi.",
    firstProfileHint: "Profilin boş görünüyor. Kısa bir biyografi ve birkaç etiket ekleyerek akışı tamamlayabilirsin.",
    avatarHint: "PNG, JPG veya WEBP dosyası kullan. Üst limit 2 MB.",
    relationshipHint: "Takip butonu yalnızca kendi profilin dışında aktif olur.",
    saveSuccess: "Profil bilgisi güncellendi.",
    avatarSuccess: "Avatar güncellendi.",
    followSuccess: "Takip durumu güncellendi.",
    notFound: "Profil bulunamadı.",
    loadError: "Profil verisi şu an okunmuyor."
  }
} as const;