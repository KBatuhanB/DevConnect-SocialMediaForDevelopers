export const profileFeatureConfig = {
  paths: {
    myProfile: "/profile",
    detail: (profileId: string) => `/profile/${profileId}`
  },
  api: {
    mePath: "/api/profiles/me",
    detailPath: (profileId: string) => `/api/profiles/${profileId}`,
    followPath: (profileId: string) => `/api/profiles/${profileId}/follow`,
    avatarPath: "/api/profiles/me/avatar"
  },
  queryKeys: {
    root: ["profiles"] as const,
    me: ["profiles", "me"] as const,
    detail: (profileId: string) => ["profiles", "detail", profileId] as const
  },
  form: {
    bioMaxLength: 300,
    skillMaxCount: 10,
    skillMaxLength: 24,
    skillSeparator: ",",
    bioPlaceholder: "Kisa, teknik ve net bir biyografi yaz.",
    skillsPlaceholder: "TypeScript, React, Node.js",
    avatarAccept: "image/png,image/jpeg,image/webp",
    avatarMaxBytes: 2_097_152
  },
  messages: {
    emptyBio: "Bu profilde henuz biyografi yok.",
    emptySkills: "Henüz beceri etiketi eklenmedi.",
    firstProfileHint: "Profilin bos gorunuyor. Kisa bir biyografi ve birkac etiket ekleyerek akisi tamamlayabilirsin.",
    avatarHint: "PNG, JPG veya WEBP dosyasi kullan. Ust limit 2 MB.",
    relationshipHint: "Takip butonu yalnizca kendi profilin disinda aktif olur.",
    saveSuccess: "Profil bilgisi guncellendi.",
    avatarSuccess: "Avatar guncellendi.",
    followSuccess: "Takip durumu guncellendi.",
    notFound: "Profil bulunamadi.",
    loadError: "Profil verisi su an okunamiyor."
  }
} as const;