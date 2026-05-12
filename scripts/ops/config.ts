export const opsSmokeConfig = {
  timeouts: {
    requestMs: 8000
  },
  web: {
    healthPaths: ["/health", "/ready"],
    pagePaths: ["/auth"]
  },
  api: {
    healthPaths: ["/health", "/ready"]
  }
} as const;