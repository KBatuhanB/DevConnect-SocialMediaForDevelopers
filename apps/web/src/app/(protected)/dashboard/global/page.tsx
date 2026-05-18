import type { Metadata } from "next";
import { ViewerDashboard } from "@web/features/viewer/components/viewer-dashboard";

export const metadata: Metadata = {
  title: "Ortak akis"
};

export default function GlobalDashboardPage() {
  return <ViewerDashboard mode="global" />;
}