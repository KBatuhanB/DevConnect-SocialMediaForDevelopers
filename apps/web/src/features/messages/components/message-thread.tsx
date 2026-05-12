"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { Textarea } from "@web/components/ui/textarea";
import { cn } from "@web/lib/cn";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { messagesFeatureConfig } from "../config";
import type { MessagePartner, ThreadMessage } from "../types";

type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting" | "offline";

type MessageThreadProps = {
  connectionState: ConnectionState;
  draft: string;
  hasOlder: boolean;
  isError: boolean;
  isLoading: boolean;
  isLoadingOlder: boolean;
  isSending: boolean;
  items: ThreadMessage[];
  onDraftChange: (value: string) => void;
  onLoadOlder: () => void;
  onReconnect: () => void;
  onRetryLoad: () => void;
  onRetryMessage: (key: string) => void;
  onSend: () => void | Promise<void>;
  partner: MessagePartner | null;
  showRealtimeWarning: boolean;
};

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

function readDateLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long"
  }).format(new Date(value));
}

function readTimeLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function readStatusLabel(item: ThreadMessage) {
  if (item.deliveryState === "sending") {
    return messagesFeatureConfig.messages.sending;
  }

  if (item.deliveryState === "error") {
    return messagesFeatureConfig.messages.failed;
  }

  return item.isRead ? messagesFeatureConfig.messages.read : messagesFeatureConfig.messages.sent;
}

function readConnectionLabel(connectionState: ConnectionState) {
  switch (connectionState) {
    case "connected":
      return messagesFeatureConfig.messages.connectionConnected;
    case "connecting":
      return messagesFeatureConfig.messages.connectionConnecting;
    case "reconnecting":
      return messagesFeatureConfig.messages.connectionReconnecting;
    case "offline":
      return messagesFeatureConfig.messages.connectionOffline;
    default:
      return messagesFeatureConfig.messages.connectionConnecting;
  }
}

export function MessageThread({
  connectionState,
  draft,
  hasOlder,
  isError,
  isLoading,
  isLoadingOlder,
  isSending,
  items,
  onDraftChange,
  onLoadOlder,
  onReconnect,
  onRetryLoad,
  onRetryMessage,
  onSend,
  partner,
  showRealtimeWarning
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const latestMessageKey = items[items.length - 1]?.key;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end"
    });
  }, [latestMessageKey, partner?.id]);

  if (!partner) {
    return (
      <Card className="messages-thread-card">
        <EmptyState
          description={messagesFeatureConfig.messages.emptyThreadDescription}
          title={messagesFeatureConfig.messages.emptyThreadTitle}
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="messages-thread-card">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-block" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="messages-thread-card">
        <EmptyState
          actionLabel="Tekrar dene"
          description={messagesFeatureConfig.messages.historyLoadError}
          onAction={onRetryLoad}
          title="Mesaj gecmisi okunamadi"
        />
      </Card>
    );
  }

  const rows: React.ReactNode[] = [];
  let previousDay = "";

  for (const item of items) {
    const currentDay = item.createdAt.slice(0, 10);

    if (currentDay !== previousDay) {
      previousDay = currentDay;
      rows.push(
        <div className="message-day-divider" key={`day-${currentDay}`}>
          <span>{readDateLabel(item.createdAt)}</span>
        </div>
      );
    }

    rows.push(
      <div className={cn("message-row", item.isMine && "message-row-mine")} key={item.key}>
        <div
          className={cn(
            "message-bubble",
            item.isMine && "message-bubble-mine",
            item.deliveryState === "error" && "message-bubble-error"
          )}
        >
          <p>{item.content}</p>

          <div className="message-meta-row">
            <span>{readTimeLabel(item.createdAt)}</span>
            {item.isMine ? <span>{readStatusLabel(item)}</span> : null}
            {item.deliveryState === "error" ? (
              <button className="ui-link" onClick={() => onRetryMessage(item.key)} type="button">
                {messagesFeatureConfig.messages.retryButton}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="messages-thread-card">
      <div className="section-head">
        <div className="conversation-item-main">
          <div className="message-avatar">
            {partner.avatarUrl ? (
              <img alt={`${partner.username} avatar`} className="message-avatar-image" src={partner.avatarUrl} />
            ) : (
              <span>{readInitial(partner.username)}</span>
            )}
          </div>

          <div>
            <p className="eyebrow">Aktif DM</p>
            <h2>{partner.username}</h2>
          </div>
        </div>

        <Link className="ui-link" href={profileFeatureConfig.paths.detail(partner.id)}>
          {messagesFeatureConfig.messages.profileLink}
        </Link>
      </div>

      <div className="message-thread-toolbar">
        <span
          className={cn(
            "message-status-chip",
            connectionState === "connected" && !showRealtimeWarning && "message-status-chip-success",
            (connectionState === "offline" || showRealtimeWarning) && "message-status-chip-error"
          )}
        >
          {showRealtimeWarning ? messagesFeatureConfig.messages.realtimeUnavailable : readConnectionLabel(connectionState)}
        </span>

        {(connectionState === "offline" || connectionState === "reconnecting") && !showRealtimeWarning ? (
          <Button onClick={onReconnect} type="button" variant="secondary">
            Kanali yenile
          </Button>
        ) : null}
      </div>

      {hasOlder ? (
        <div className="message-older-row">
          <Button disabled={isLoadingOlder} onClick={onLoadOlder} type="button" variant="secondary">
            {isLoadingOlder ? messagesFeatureConfig.messages.loadingOlder : messagesFeatureConfig.messages.loadOlder}
          </Button>
        </div>
      ) : null}

      <div className="message-history">
        {rows.length > 0 ? rows : <p className="message-history-note">{messagesFeatureConfig.messages.emptyHistoryDescription}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        className="message-composer"
        onSubmit={(event) => {
          event.preventDefault();
          void onSend();
        }}
      >
        <Textarea
          maxLength={messagesFeatureConfig.composer.maxLength}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={messagesFeatureConfig.composer.placeholder}
          rows={4}
          value={draft}
        />

        <div className="message-composer-meta">
          <span className="muted">
            {draft.length} / {messagesFeatureConfig.composer.maxLength}
          </span>

          <Button disabled={isSending || draft.trim().length === 0} type="submit">
            {isSending ? messagesFeatureConfig.messages.sending : messagesFeatureConfig.messages.sendButton}
          </Button>
        </div>
      </form>
    </Card>
  );
}