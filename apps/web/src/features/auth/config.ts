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
    unauthorizedHint: "Korumalı alana geçmek için önce giriş yap.",
    noSession: "Henüz aktif bir oturum yok.",
    activeSession: "Aktif oturum bulundu. Korunan sayfaya geçebilirsin.",
    emailVerification: "Kayıt oluştu. Devam etmeden önce e-posta doğrulamasını tamamla."
  }
} as const;