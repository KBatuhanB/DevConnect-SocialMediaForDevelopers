import type { Metadata } from "next";
import { ViewerDashboard } from "@web/features/viewer/components/viewer-dashboard";
import { appShellConfig } from "@web/features/app-shell/config";

export const metadata: Metadata = {
  title: appShellConfig.pages.dashboardTitle
};

export default function DashboardPage() {
  return <ViewerDashboard />;
}