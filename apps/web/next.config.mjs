import { fileURLToPath } from "node:url";

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const webSourcePath = fileURLToPath(new URL("./src", import.meta.url));

/** Faz 13'te uretim headers eklenirken konfigurasyon yine sade tutulur. */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Faz 14 sonrasi da dev/build ayni alias mantigini kullansin.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@web": webSourcePath
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;