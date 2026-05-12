import type { Metadata } from "next";
import { AuthHome } from "@web/features/auth/components/auth-home";
import { appShellConfig } from "@web/features/app-shell/config";

export const metadata: Metadata = {
  title: appShellConfig.pages.authTitle
};

export default function AuthPage() {
  return <AuthHome />;
}