import type { Metadata } from "next";
import { appShellConfig } from "@web/features/app-shell/config";
import { MessagesWorkspace } from "@web/features/messages/components/messages-workspace";

export const metadata: Metadata = {
  title: appShellConfig.pages.messagesTitle
};

function readInitialPartnerId(searchParams: { profileId?: string | string[] }) {
  const value = searchParams.profileId;

  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function MessagesPage({ searchParams }: { searchParams: { profileId?: string | string[] } }) {
  return <MessagesWorkspace initialPartnerId={readInitialPartnerId(searchParams)} />;
}