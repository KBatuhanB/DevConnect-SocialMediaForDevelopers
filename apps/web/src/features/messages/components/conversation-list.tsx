"use client";

import { Card } from "@web/components/ui/card";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { cn } from "@web/lib/cn";
import { messagesFeatureConfig } from "../config";
import type { ConversationSummary } from "../types";

type ConversationListProps = {
  activePartnerId: string;
  conversations: ConversationSummary[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  onSelect: (partnerId: string) => void;
};

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

function readPreview(conversation: ConversationSummary) {
  if (!conversation.lastMessage) {
    return "Henuz mesaj yok.";
  }

  return conversation.lastMessage.content.length > 88
    ? `${conversation.lastMessage.content.slice(0, 88)}...`
    : conversation.lastMessage.content;
}

function readTimeLabel(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function ConversationList({
  activePartnerId,
  conversations,
  isError,
  isLoading,
  onRetry,
  onSelect
}: ConversationListProps) {
  return (
    <Card className="messages-list-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Faz 11 mesajlasma</p>
          <h2>{messagesFeatureConfig.messages.listTitle}</h2>
        </div>
        <span className="chip">{conversations.length} kayit</span>
      </div>

      {isLoading ? (
        <div className="messages-list">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="conversation-item" key={index}>
              <Skeleton className="skeleton-title" />
              <Skeleton className="skeleton-line" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          actionLabel="Tekrar dene"
          description={messagesFeatureConfig.messages.listLoadError}
          onAction={onRetry}
          title="Konusma listesi okunamadi"
        />
      ) : conversations.length === 0 ? (
        <EmptyState
          description={messagesFeatureConfig.messages.emptyListDescription}
          title={messagesFeatureConfig.messages.emptyListTitle}
        />
      ) : (
        <div className="messages-list">
          {conversations.map((conversation) => (
            <button
              className={cn(
                "conversation-item",
                conversation.partner.id === activePartnerId && "conversation-item-active"
              )}
              key={conversation.partner.id}
              onClick={() => onSelect(conversation.partner.id)}
              type="button"
            >
              <div className="conversation-item-top">
                <div className="conversation-item-main">
                  <div className="message-avatar">
                    {conversation.partner.avatarUrl ? (
                      <img alt={`${conversation.partner.username} avatar`} className="message-avatar-image" src={conversation.partner.avatarUrl} />
                    ) : (
                      <span>{readInitial(conversation.partner.username)}</span>
                    )}
                  </div>

                  <div>
                    <strong>{conversation.partner.username}</strong>
                    <p>{readPreview(conversation)}</p>
                  </div>
                </div>

                <div className="conversation-side-copy">
                  {conversation.updatedAt ? <span>{readTimeLabel(conversation.updatedAt)}</span> : null}
                  {conversation.unreadCount > 0 ? <span className="chip">{conversation.unreadCount} yeni</span> : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}