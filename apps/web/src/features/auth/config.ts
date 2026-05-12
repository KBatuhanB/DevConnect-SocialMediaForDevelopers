export const authFeatureConfig = {
  paths: {
    home: "/",
    auth: "/auth",
    dashboard: "/dashboard"
  },
  api: {
    registerPath: "/auth/register",
    loginPath: "/auth/login",
    logoutPath: "/auth/logout",
    sessionPath: "/api/session"
  },
  cookies: {
    accessTokenName: "devconnect-access-token"
  },
  form: {
    usernamePlaceholder: "ornek_kullanici",
    emailPlaceholder: "ornek@mail.com",
    passwordPlaceholder: "En az 8 karakter",
    usernameMinLength: 3,
    usernameMaxLength: 50,
    passwordMinLength: 8,
    passwordMaxLength: 72
  },
  messages: {
    unauthorizedHint: "Korumali alana gecmek icin once giris yap.",
    noSession: "Henuz aktif bir oturum yok.",
    activeSession: "Aktif oturum bulundu. Korunan sayfaya gecebilirsin.",
    emailVerification: "Kayit olustu. Devam etmeden once e-posta dogrulamasini tamamla."
  }
} as const;