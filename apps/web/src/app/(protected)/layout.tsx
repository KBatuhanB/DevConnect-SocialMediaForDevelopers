import { redirect } from "next/navigation";
import { AppFrame } from "@web/features/app-shell/components/app-frame";
import { authFeatureConfig } from "@web/features/auth/config";
import { hasServerSession } from "@web/features/auth/server";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!hasServerSession()) {
    redirect(authFeatureConfig.paths.auth);
  }

  return <AppFrame layout="topbar">{children}</AppFrame>;
}