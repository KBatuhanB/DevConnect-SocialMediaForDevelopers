import type { Metadata } from "next";
import { appShellConfig } from "@web/features/app-shell/config";
import { ProfileWorkspace } from "@web/features/profiles/components/profile-workspace";

export const metadata: Metadata = {
  title: appShellConfig.pages.profileTitle
};

export default function ProfilePage() {
  return <ProfileWorkspace />;
}