"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@web/components/providers/toast-provider";
import { webEnv } from "@web/config/env";
import { readApiErrorMessage } from "@web/lib/api-client";
import { createRealtimeSupabaseClient } from "@web/lib/supabase-browser";
import { messagesFeatureConfig } from "../config";
import {
  upsertMessageInHistoryCache,
  updateMessageInHistoryCache,
  useMarkConversationReadMutation,
  useMessagesSidebarQuery,
  useMessageHistoryInfiniteQuery,
  useMessagesRealtimeAuthQuery,
  useSendMessageMutation
} from "../hooks";
import type { MessageView, ThreadMessage } from "../types";
import { ConversationList } from "./conversation-list";
import { MessageThread } from "./message-thread";

type MessagesWorkspaceProps = {
  initialPartnerId?: string;
};

type RealtimeMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

function isViewerMessage(row: RealtimeMessageRow, userId: string) {
  return row.sender_id === userId || row.receiver_id === userId;
}

function isConversationMessage(row: RealtimeMessageRow, userId: string, partnerId: string) {
  return (
    (row.sender_id === userId && row.receiver_id === partnerId) ||
    (row.sender_id === partnerId && row.receiver_id === userId)
  );
}

function mapRealtimeRow(row: RealtimeMessageRow, userId: string): MessageView {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    isRead: row.is_read,
    createdAt: row.created_at,
    isMine: row.sender_id === userId
  };
}

export function MessagesWorkspace({ initialPartnerId = "" }: MessagesWorkspaceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [draft, setDraft] = useState("");
  const [pendingMessagesByPartner, setPendingMessagesByPartner] = useState<Record<string, ThreadMessage[]>>({});
  const isMessagesPage = pathname === messagesFeatureConfig.paths.main;
  const routePartnerId = isMessagesPage ? (searchParams.get(messagesFeatureConfig.queryParams.partnerId) ?? initialPartnerId) : "";
  const sidebarQuery = useMessagesSidebarQuery(isMessagesPage);
  const recentConversations = sidebarQuery.data?.conversations ?? [];
  const followingProfiles = sidebarQuery.data?.followingProfiles ?? [];
  const selectedConversation = recentConversations.find((item) => item.partner.id === routePartnerId) ?? null;
  const selectedFollowingProfile = followingProfiles.find((item) => item.id === routePartnerId) ?? null;
  const activePartnerId = isMessagesPage ? routePartnerId || recentConversations[0]?.partner.id || followingProfiles[0]?.id || "" : "";
  const canUseRealtime = webEnv.supabaseUrl.length > 0 && webEnv.supabaseAnonKey.length > 0;
  const realtimeAuthQuery = useMessagesRealtimeAuthQuery(isMessagesPage && activePartnerId.length > 0 && canUseRealtime);
  const historyQuery = useMessageHistoryInfiniteQuery(activePartnerId, isMessagesPage && activePartnerId.length > 0);
  const sendMessageMutation = useSendMessageMutation();
  const markConversationReadMutation = useMarkConversationReadMutation();
  const markConversationRead = markConversationReadMutation.mutateAsync;

  const historyItems = useMemo(() => {
    const resolvedItems: MessageView[] = [];
    const seenIds = new Set<string>();

    for (const page of [...(historyQuery.data?.pages ?? [])].reverse()) {
      for (const item of page.items) {
        if (seenIds.has(item.id)) {
          continue;
        }

        seenIds.add(item.id);
        resolvedItems.push(item);
      }
    }

    return resolvedItems;
  }, [historyQuery.data?.pages]);

  const partner = historyQuery.data?.pages[0]?.partner ?? selectedConversation?.partner ?? selectedFollowingProfile ?? null;
  const pendingItems = useMemo(() => pendingMessagesByPartner[activePartnerId] ?? [], [activePartnerId, pendingMessagesByPartner]);
  const threadItems = useMemo<ThreadMessage[]>(() => {
    const persistedItems = historyItems.map((item) => ({
      ...item,
      key: item.id,
      deliveryState: "sent" as const,
      errorMessage: null
    }));

    return [...persistedItems, ...pendingItems].sort(
      (left, right) => left.createdAt.localeCompare(right.createdAt) || left.key.localeCompare(right.key)
    );
  }, [historyItems, pendingItems]);

  function setPendingMessages(partnerId: string, update: (items: ThreadMessage[]) => ThreadMessage[]) {
    setPendingMessagesByPartner((current) => ({
      ...current,
      [partnerId]: update(current[partnerId] ?? [])
    }));
  }

  useEffect(() => {
    document.body.classList.add("messages-page-active");
    return () => {
      document.body.classList.remove("messages-page-active");
    };
  }, []);

  useEffect(() => {
    if (!isMessagesPage) {
      setDraft("");
      return;
    }

    setDraft("");
  }, [activePartnerId, isMessagesPage]);

  useEffect(() => {
    if (!isMessagesPage || !activePartnerId) {
      return;
    }

    void markConversationRead(activePartnerId).catch(() => undefined);
  }, [activePartnerId, isMessagesPage, markConversationRead]);

  useEffect(() => {
    if (!isMessagesPage || !activePartnerId) {
      return;
    }

    if (!canUseRealtime) {
      return;
    }

    if (!realtimeAuthQuery.data) {
      return;
    }

    const realtimeAuth = realtimeAuthQuery.data;
    const client = createRealtimeSupabaseClient(realtimeAuth.accessToken);
    let channel: ReturnType<typeof client.channel> | null = null;
    let isDisposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectAttempt = 0;

    const disposeChannel = () => {
      if (!channel) {
        return;
      }

      void client.removeChannel(channel);
      channel = null;
    };

    const connect = () => {
      if (isDisposed) {
        return;
      }

      disposeChannel();
      // Tek kanalda hem yeni mesajlari hem de okundu guncellemelerini dinliyoruz.
      channel = client
        .channel(`messages:${realtimeAuth.userId}:${activePartnerId}:${reconnectAttempt}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages"
          },
          (payload) => {
            const row = payload.new as RealtimeMessageRow;

            if (!isViewerMessage(row, realtimeAuth.userId)) {
              return;
            }

            void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.sidebar });

            if (!isConversationMessage(row, realtimeAuth.userId, activePartnerId)) {
              return;
            }

            const message = mapRealtimeRow(row, realtimeAuth.userId);

            upsertMessageInHistoryCache(queryClient, activePartnerId, message);          setTimeout(() => {
            void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.history(activePartnerId) });
          }, 1000);            if (!message.isMine) {
              void markConversationRead(activePartnerId).catch(() => undefined);
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages"
          },
          (payload) => {
            const row = payload.new as RealtimeMessageRow;

            if (!isViewerMessage(row, realtimeAuth.userId)) {
              return;
            }

            void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.sidebar });

            if (!isConversationMessage(row, realtimeAuth.userId, activePartnerId)) {
              return;
            }

            updateMessageInHistoryCache(queryClient, activePartnerId, mapRealtimeRow(row, realtimeAuth.userId));
            setTimeout(() => {
              void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.history(activePartnerId) });
            }, 1000);
          }
        )
        .subscribe((status) => {
          if (isDisposed) {
            return;
          }

          if (status === "SUBSCRIBED") {
            reconnectAttempt = 0;
            return;
          }

          if (status !== "CHANNEL_ERROR" && status !== "TIMED_OUT" && status !== "CLOSED") {
            return;
          }

          disposeChannel();

          if (reconnectAttempt >= messagesFeatureConfig.pagination.maxReconnectAttempts) {
            return;
          }

          if (retryTimer) {
            clearTimeout(retryTimer);
          }

          const delay =
            messagesFeatureConfig.pagination.reconnectBackoffMs[
              Math.min(reconnectAttempt, messagesFeatureConfig.pagination.reconnectBackoffMs.length - 1)
            ];

          reconnectAttempt += 1;
          retryTimer = setTimeout(connect, delay);
        });
    };

    connect();

    return () => {
      isDisposed = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      disposeChannel();
      void client.removeAllChannels();
    };
  }, [
    activePartnerId,
    canUseRealtime,
    isMessagesPage,
    markConversationRead,
    queryClient,
    realtimeAuthQuery.data,
    realtimeAuthQuery.isLoading
  ]);

  async function submitMessage(partnerId: string, rawContent: string, key = crypto.randomUUID()) {
    const optimisticMessage: ThreadMessage = {
      id: key,
      key,
      senderId: realtimeAuthQuery.data?.userId ?? "me",
      receiverId: partnerId,
      content: rawContent.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      isMine: true,
      deliveryState: "sending",
      errorMessage: null
    };

    setPendingMessages(partnerId, (items) => {
      const hasExisting = items.some((item) => item.key === key);

      if (hasExisting) {
        return items.map((item) =>
          item.key === key
            ? {
                ...item,
                deliveryState: "sending",
                errorMessage: null
              }
            : item
        );
      }

      return [...items, optimisticMessage];
    });

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: partnerId,
        content: rawContent
      });

      setPendingMessages(partnerId, (items) => items.filter((item) => item.key !== key));
      
      setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.history(partnerId) });
      }, 1000);
    } catch (error) {
      setPendingMessages(partnerId, (items) =>
        items.map((item) =>
          item.key === key
            ? {
                ...item,
                deliveryState: "error",
                errorMessage: readApiErrorMessage(error)
              }
            : item
        )
      );

      pushToast({
        tone: "error",
        title: "Mesaj gonderilemedi",
        description: readApiErrorMessage(error)
      });
    }
  }

  async function handleSend() {
    if (!activePartnerId || draft.trim().length === 0) {
      return;
    }

    const nextDraft = draft;

    setDraft("");
    await submitMessage(activePartnerId, nextDraft);
  }

  async function handleRetryMessage(key: string) {
    const failedItem = (pendingMessagesByPartner[activePartnerId] ?? []).find((item) => item.key === key);

    if (!failedItem) {
      return;
    }

    await submitMessage(activePartnerId, failedItem.content, key);
  }

  return (
    <div className="messages-page-shell">
      <div className="messages-layout">
        <ConversationList
          activePartnerId={activePartnerId}
          conversations={recentConversations}
          followingProfiles={followingProfiles}
          isError={sidebarQuery.isError}
          isLoading={sidebarQuery.isLoading}
          onRetry={() => void sidebarQuery.refetch()}
          onSelect={(partnerId) => {
            router.replace(messagesFeatureConfig.paths.detail(partnerId), {
              scroll: false
            });
          }}
        />

        <MessageThread
          draft={draft}
          hasOlder={Boolean(historyQuery.hasNextPage)}
          isError={historyQuery.isError}
          isLoading={historyQuery.isLoading}
          isLoadingOlder={historyQuery.isFetchingNextPage}
          isSending={sendMessageMutation.isPending}
          items={threadItems}
          onDraftChange={setDraft}
          onLoadOlder={() => void historyQuery.fetchNextPage()}
          onRetryLoad={() => void historyQuery.refetch()}
          onRetryMessage={(key) => void handleRetryMessage(key)}
          onSend={() => handleSend()}
          partner={partner}
        />
      </div>
    </div>
  );
}