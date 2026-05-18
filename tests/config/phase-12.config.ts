export const phase12TestConfig = {
  ids: {
    viewer: "11111111-1111-4111-8111-111111111111",
    peer: "22222222-2222-4222-8222-222222222222",
    stranger: "33333333-3333-4333-8333-333333333333"
  },
  api: {
    protectedRoutes: [
      {
        method: "get",
        path: "/api/me"
      },
      {
        method: "get",
        path: "/api/feed"
      },
      {
        method: "get",
        path: "/api/profiles/me"
      },
      {
        method: "get",
        path: "/api/profiles/11111111-1111-4111-8111-111111111111"
      },
      {
        method: "post",
        path: "/api/posts",
        body: {}
      },
      {
        method: "get",
        path: "/api/messages"
      },
      {
        method: "get",
        path: "/api/messages/realtime-auth"
      }
    ],
    authRateLimitLimit: 10,
    authRateLimitAttempts: 11,
    authRateLimitPath: "/auth/login"
  },
  e2e: {
    baseUrl: process.env.PHASE12_E2E_BASE_URL ?? "http://localhost:3007",
    webPort: Number(process.env.PHASE12_E2E_WEB_PORT ?? 3007),
    apiBaseUrl: process.env.PHASE12_E2E_API_BASE_URL ?? "http://localhost:4000",
    authCookie: {
      name: "devconnect-access-token",
      value: "phase12-auth-session"
    },
    routes: {
      auth: "/auth",
      dashboard: "/dashboard",
      profile: "/profile",
      peerProfile: "/profile/22222222-2222-4222-8222-222222222222",
      messages: "/messages"
    },
    timeouts: {
      testMs: 60_000,
      expectMs: 10_000,
      webServerMs: 120_000
    },
    smoke: {
      routes: ["/auth", "/dashboard", "/profile", "/messages"]
    }
  }
} as const;