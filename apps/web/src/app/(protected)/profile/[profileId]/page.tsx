import type { Metadata } from "next";
import { appShellConfig } from "@web/features/app-shell/config";
import { ProfileWorkspace } from "@web/features/profiles/components/profile-workspace";

export const metadata: Metadata = {
  title: appShellConfig.pages.profileDetailTitle
};

export default function ProfileDetailPage({ params }: { params: { profileId: string } }) {
  return <ProfileWorkspace profileId={params.profileId} />;
}