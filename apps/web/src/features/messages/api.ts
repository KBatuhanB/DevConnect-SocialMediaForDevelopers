import { apiRequest } from "@web/lib/api-client";
import { messagesFeatureConfig } from "./config";
import type { ConversationSummary, MessageCursor, MessageHistoryPage, MessageView, RealtimeAuth, SendMessageInput } from "./types";

function createHistoryQuery(cursor: MessageCursor | null) {
  if (!cursor) {
    return "";
  }

  const query = new URLSearchParams({
    cursorCreatedAt: cursor.createdAt,
    cursorId: cursor.id
  });

  return `?${query.toString()}`;
}

export async function getRealtimeAuth() {
  const payload = await apiRequest<{ auth: RealtimeAuth }>(messagesFeatureConfig.api.realtimeAuthPath, {
    method: "GET"
  });

  return payload.auth;
}

export async function getConversations() {
  const payload = await apiRequest<{ conversations: ConversationSummary[] }>(messagesFeatureConfig.api.listPath, {
    method: "GET"
  });

  return payload.conversations;
}

export async function getConversationHistory(partnerId: string, cursor: MessageCursor | null) {
  const payload = await apiRequest<{ page: MessageHistoryPage }>(
    `${messagesFeatureConfig.api.historyPath(partnerId)}${createHistoryQuery(cursor)}`,
    {
      method: "GET"
    }
  );

  return payload.page;
}

export async function sendMessage(input: SendMessageInput) {
  const payload = await apiRequest<{ message: MessageView }>(messagesFeatureConfig.api.listPath, {
    method: "POST",
    body: JSON.stringify(input)
  });

  return payload.message;
}

export async function markConversationAsRead(partnerId: string) {
  const payload = await apiRequest<{ result: { updatedCount: number } }>(messagesFeatureConfig.api.readPath(partnerId), {
    method: "POST"
  });

  return payload.result;
}