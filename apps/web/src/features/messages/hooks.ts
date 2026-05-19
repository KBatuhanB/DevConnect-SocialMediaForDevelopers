"use client";

import {
  type InfiniteData,
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { getConversationHistory, getMessagesSidebar, getRealtimeAuth, markConversationAsRead, sendMessage } from "./api";
import { messagesFeatureConfig } from "./config";
import type { MessageCursor, MessageHistoryPage, MessageView, MessagesSidebarData, RealtimeAuth, SendMessageInput } from "./types";

type MessageHistoryCache = InfiniteData<MessageHistoryPage, MessageCursor | null>;

function updateHistoryCache(
  queryClient: QueryClient,
  partnerId: string,
  update: (current: MessageHistoryCache) => MessageHistoryCache
) {
  queryClient.setQueryData<MessageHistoryCache | undefined>(messagesFeatureConfig.queryKeys.history(partnerId), (current) => {
    if (!current) {
      return current;
    }

    return update(current);
  });
}

export function upsertMessageInHistoryCache(queryClient: QueryClient, partnerId: string, message: MessageView) {
  updateHistoryCache(queryClient, partnerId, (current) => {
    let foundExisting = false;

    const pages = current.pages.map((page, pageIndex) => {
      const hasExistingMessage = page.items.some((item) => item.id === message.id);

      if (hasExistingMessage) {
        foundExisting = true;

        return {
          ...page,
          items: page.items.map((item) => (item.id === message.id ? message : item))
        };
      }

      if (pageIndex !== 0) {
        return page;
      }

      return page;
    });

    if (foundExisting || pages.length === 0) {
      return {
        ...current,
        pages
      };
    }

    return {
      ...current,
      pages: pages.map((page, pageIndex) =>
        pageIndex === 0
          ? {
              ...page,
              items: [...page.items, message]
            }
          : page
      )
    };
  });

  void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.sidebar });
}

export function updateMessageInHistoryCache(queryClient: QueryClient, partnerId: string, message: MessageView) {
  updateHistoryCache(queryClient, partnerId, (current) => ({
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => (item.id === message.id ? message : item))
    }))
  }));

  void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.sidebar });
}

export function useMessagesRealtimeAuthQuery(enabled = true) {
  return useQuery<RealtimeAuth>({
    queryKey: messagesFeatureConfig.queryKeys.realtimeAuth,
    queryFn: getRealtimeAuth,
    enabled
  });
}

export function useMessagesSidebarQuery(enabled = true) {
  return useQuery<MessagesSidebarData>({
    queryKey: messagesFeatureConfig.queryKeys.sidebar,
    queryFn: getMessagesSidebar,
    enabled
  });
}

export function useMessageHistoryInfiniteQuery(partnerId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: messagesFeatureConfig.queryKeys.history(partnerId),
    queryFn: ({ pageParam }) => getConversationHistory(partnerId, pageParam as MessageCursor | null),
    initialPageParam: null as MessageCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && partnerId.length > 0
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendMessageInput) => sendMessage(input),
    onSuccess(message) {
      const partnerId = message.isMine ? message.receiverId : message.senderId;

      upsertMessageInHistoryCache(queryClient, partnerId, message);
    }
  });
}

export function useMarkConversationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) => markConversationAsRead(partnerId),
    onSuccess(_result, partnerId) {
      void queryClient.invalidateQueries({ queryKey: messagesFeatureConfig.queryKeys.sidebar });
    }
  });
}