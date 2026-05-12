"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  useMessageConversationsQuery,
  useMessageHistoryInfiniteQuery,
  useMessagesRealtimeAuthQuery,
  useSendMessageMutation
} from "../hooks";
import type { ConversationSummary, MessageView, ThreadMessage } from "../types";
import { ConversationList } from "./conversation-list";
import { MessageThread } from "./message-thread";

type MessagesWorkspaceProps = {
  initialPartnerId?: string;
};

type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting" | "offline";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [draft, setDraft] = useState("");
  const [realtimeRevision, setRealtimeRevision] = useState(0);
  const [pendingMessagesByPartner, setPendingMessagesByPartner] = useState<Record<string, ThreadMessage[]>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const routePartnerId = searchParams.get(messagesFeatureConfig.queryParams.partnerId) ?? initialPartnerId;
  const conversationsQuery = useMessageConversationsQuery();
  const selectedConversation = conversationsQuery.data?.find((item) => item.partner.id === routePartnerId) ?? null;
  const activePartnerId = routePartnerId || conversationsQuery.data?.[0]?.partner.id || "";
  const canUseRealtime = webEnv.supabaseUrl.length > 0 && webEnv.supabaseAnonKey.length > 0;
  const realtimeAuthQuery = useMessagesRealtimeAuthQuery(activePartnerId.length > 0 && canUseRealtime);
  const historyQuery = useMessageHistoryInfiniteQuery(activePartnerId, activePartnerId.length > 0);
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

  const partner = historyQuery.data?.pages[0]?.partner ?? selectedConversation?.partner ?? null;
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

  const conversations = useMemo(() => {
    const items = conversationsQuery.data ?? [];

    if (!partner || !activePartnerId || items.some((conversation) => conversation.partner.id === activePartnerId)) {
      return items;
    }

    const lastVisibleMessage = threadItems[threadItems.length - 1] ?? null;

    return [
      {
        partner,
        lastMessage: lastVisibleMessage,
        unreadCount: 0,
        updatedAt: lastVisibleMessage?.createdAt ?? new Date().toISOString()
      } satisfies ConversationSummary,
      ...items
    ];
  }, [activePartnerId, conversationsQuery.data, partner, threadItems]);

  function setPendingMessages(partnerId: string, update: (items: ThreadMessage[]) => ThreadMessage[]) {
    setPendingMessagesByPartner((current) => ({
      ...current,
      [partnerId]: update(current[partnerId] ?? [])
    }));
  }

  useEffect(() => {
    const firstConversationId = conversationsQuery.data?.[0]?.partner.id;

    if (routePartnerId || !firstConversationId) {
      return;
    }

    router.replace(messagesFeatureConfig.paths.detail(firstConversationId), {
      scroll: false
    });
  }, [conversationsQuery.data, routePartnerId, router]);

  useEffect(() => {
    setDraft("");
  }, [activePartnerId]);

  useEffect(() => {
    if (!activePartnerId) {
      return;
    }

    if (!historyQuery.data) {
      return;
    }

    void markConversationRead(activePartnerId).catch(() => undefined);
  }, [activePartnerId, historyQuery.data, markConversationRead]);

  useEffect(() => {
    if (!activePartnerId) {
      setConnectionState("idle");
      return;
    }

    if (!canUseRealtime) {
      setConnectionState("offline");
      return;
    }

    if (!realtimeAuthQuery.data) {
      setConnectionState(realtimeAuthQuery.isLoading ? "connecting" : "offline");
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

      setConnectionState(reconnectAttempt === 0 ? "connecting" : "reconnecting");

      disposeChannel();
      // Tek kanalda hem yeni mesajlari hem de okundu guncellemelerini dinliyoruz.
      channel = client
        .channel(`messages:${realtimeAuth.userId}:${activePartnerId}:${realtimeRevision}:${reconnectAttempt}`)
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

            void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.conversations });

            if (!isConversationMessage(row, realtimeAuth.userId, activePartnerId)) {
              return;
            }

            const message = mapRealtimeRow(row, realtimeAuth.userId);

            upsertMessageInHistoryCache(queryClient, activePartnerId, message);

            if (!message.isMine) {
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

            void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.conversations });

            if (!isConversationMessage(row, realtimeAuth.userId, activePartnerId)) {
              return;
            }

            updateMessageInHistoryCache(queryClient, activePartnerId, mapRealtimeRow(row, realtimeAuth.userId));
          }
        )
        .subscribe((status) => {
          if (isDisposed) {
            return;
          }

          if (status === "SUBSCRIBED") {
            reconnectAttempt = 0;
            setConnectionState("connected");
            return;
          }

          if (status !== "CHANNEL_ERROR" && status !== "TIMED_OUT" && status !== "CLOSED") {
            return;
          }

          disposeChannel();

          if (reconnectAttempt >= messagesFeatureConfig.pagination.maxReconnectAttempts) {
            setConnectionState("offline");
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
          setConnectionState("reconnecting");
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
    markConversationRead,
    queryClient,
    realtimeAuthQuery.data,
    realtimeAuthQuery.isLoading,
    realtimeRevision
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
    <div className="messages-layout">
      <ConversationList
        activePartnerId={activePartnerId}
        conversations={conversations}
        isError={conversationsQuery.isError}
        isLoading={conversationsQuery.isLoading}
        onRetry={() => void conversationsQuery.refetch()}
        onSelect={(partnerId) => {
          router.replace(messagesFeatureConfig.paths.detail(partnerId), {
            scroll: false
          });
        }}
      />

      <MessageThread
        connectionState={connectionState}
        draft={draft}
        hasOlder={Boolean(historyQuery.hasNextPage)}
        isError={historyQuery.isError}
        isLoading={historyQuery.isLoading}
        isLoadingOlder={historyQuery.isFetchingNextPage}
        isSending={sendMessageMutation.isPending}
        items={threadItems}
        onDraftChange={setDraft}
        onLoadOlder={() => void historyQuery.fetchNextPage()}
        onReconnect={() => setRealtimeRevision((current) => current + 1)}
        onRetryLoad={() => void historyQuery.refetch()}
        onRetryMessage={(key) => void handleRetryMessage(key)}
        onSend={() => handleSend()}
        partner={partner}
        showRealtimeWarning={!canUseRealtime || realtimeAuthQuery.isError}
      />
    </div>
  );
}