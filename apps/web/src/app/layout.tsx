import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "../components/providers/app-providers";
import { appShellConfig } from "../features/app-shell/config";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: appShellConfig.app.name,
    template: `%s | ${appShellConfig.app.name}`
  },
  description: appShellConfig.app.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${bodyFont.variable} ${displayFont.variable}`} lang="tr">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}