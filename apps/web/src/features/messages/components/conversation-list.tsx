"use client";

import { Card } from "@web/components/ui/card";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { cn } from "@web/lib/cn";
import { messagesFeatureConfig } from "../config";
import type { ConversationSummary, MessagePartner } from "../types";
import { MessageAvatar } from "./message-avatar";

type ConversationListProps = {
  activePartnerId: string;
  conversations: ConversationSummary[];
  followingProfiles: MessagePartner[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  onSelect: (partnerId: string) => void;
};

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
  followingProfiles,
  isError,
  isLoading,
  onRetry,
  onSelect
}: ConversationListProps) {
  return (
    <Card className="messages-list-card">
      <div className="messages-sidebar-head">
        <div>
          <h2>{messagesFeatureConfig.messages.listTitle}</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="messages-sidebar-scroll messages-sidebar-scroll-loading">
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
          title="Konuşma listesi okunamadı"
        />
      ) : conversations.length === 0 && followingProfiles.length === 0 ? (
        <EmptyState
          description={messagesFeatureConfig.messages.emptyListDescription}
          title={messagesFeatureConfig.messages.emptyListTitle}
        />
      ) : (
        <div className="messages-sidebar-scroll">
          <section className="messages-sidebar-section" aria-labelledby="messages-recent-heading">
            <div className="messages-sidebar-section-head">
              <h3 id="messages-recent-heading">{messagesFeatureConfig.messages.recentTitle}</h3>
            </div>

            {conversations.length > 0 ? (
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
                        <MessageAvatar avatarUrl={conversation.partner.avatarUrl} username={conversation.partner.username} />

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
            ) : (
              <p className="messages-sidebar-note">{messagesFeatureConfig.messages.recentEmpty}</p>
            )}
          </section>

          <div className="messages-sidebar-divider" role="separator" />

          <section className="messages-sidebar-section" aria-labelledby="messages-following-heading">
            <div className="messages-sidebar-section-head">
              <h3 id="messages-following-heading">{messagesFeatureConfig.messages.followingTitle}</h3>
            </div>

            {followingProfiles.length > 0 ? (
              <div className="messages-list">
                {followingProfiles.map((profile) => (
                  <button
                    className={cn(
                      "conversation-item",
                      "conversation-item-secondary",
                      profile.id === activePartnerId && "conversation-item-active"
                    )}
                    key={profile.id}
                    onClick={() => onSelect(profile.id)}
                    type="button"
                  >
                    <div className="conversation-item-main">
                      <MessageAvatar avatarUrl={profile.avatarUrl} username={profile.username} />

                      <div>
                        <strong>{profile.username}</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="messages-sidebar-note">{messagesFeatureConfig.messages.followingEmpty}</p>
            )}
          </section>
        </div>
      )}
    </Card>
  );
}