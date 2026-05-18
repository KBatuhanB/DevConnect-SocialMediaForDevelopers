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
import { MessageAvatar } from "./message-avatar";

type MessageThreadProps = {
  draft: string;
  hasOlder: boolean;
  isError: boolean;
  isLoading: boolean;
  isLoadingOlder: boolean;
  isSending: boolean;
  items: ThreadMessage[];
  onDraftChange: (value: string) => void;
  onLoadOlder: () => void;
  onRetryLoad: () => void;
  onRetryMessage: (key: string) => void;
  onSend: () => void | Promise<void>;
  partner: MessagePartner | null;
};

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

export function MessageThread({
  draft,
  hasOlder,
  isError,
  isLoading,
  isLoadingOlder,
  isSending,
  items,
  onDraftChange,
  onLoadOlder,
  onRetryLoad,
  onRetryMessage,
  onSend,
  partner
}: MessageThreadProps) {
  const historyRef = useRef<HTMLDivElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const latestMessageKey = items[items.length - 1]?.key;

  function syncComposerHeight() {
    const textareaElement = composerTextareaRef.current;

    if (!textareaElement) {
      return;
    }

    textareaElement.style.height = "0px";

    const computedStyle = window.getComputedStyle(textareaElement);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24;
    const verticalInset =
      Number.parseFloat(computedStyle.paddingTop) +
      Number.parseFloat(computedStyle.paddingBottom) +
      Number.parseFloat(computedStyle.borderTopWidth) +
      Number.parseFloat(computedStyle.borderBottomWidth);
    const maxHeight = lineHeight * 5 + verticalInset;
    const nextHeight = Math.min(textareaElement.scrollHeight, maxHeight);

    textareaElement.style.height = `${nextHeight}px`;
    textareaElement.style.overflowY = textareaElement.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    const historyElement = historyRef.current;

    if (!historyElement) {
      return;
    }

    historyElement.scrollTo({
      top: historyElement.scrollHeight
    });
  }, [latestMessageKey, partner?.id]);

  useEffect(() => {
    syncComposerHeight();
  }, [draft, partner?.id]);

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
      <div className="section-head messages-thread-head">
        <div className="messages-thread-profile-row">
          <MessageAvatar avatarUrl={partner.avatarUrl} username={partner.username} />

          <div>
            <h2>{partner.username}</h2>
          </div>
        </div>

        <Link className="ui-link" href={profileFeatureConfig.paths.detail(partner.id)}>
          {messagesFeatureConfig.messages.profileLink}
        </Link>
      </div>

      {hasOlder ? (
        <div className="message-older-row">
          <Button disabled={isLoadingOlder} onClick={onLoadOlder} type="button" variant="secondary">
            {isLoadingOlder ? messagesFeatureConfig.messages.loadingOlder : messagesFeatureConfig.messages.loadOlder}
          </Button>
        </div>
      ) : null}

      <div className="message-history" ref={historyRef}>
        {rows.length > 0 ? rows : <p className="message-history-note">{messagesFeatureConfig.messages.emptyHistoryDescription}</p>}
      </div>

      <form
        className="message-composer"
        onSubmit={(event) => {
          event.preventDefault();
          void onSend();
        }}
      >
        <Textarea
          aria-label="Mesaj icerigi"
          ref={composerTextareaRef}
          maxLength={messagesFeatureConfig.composer.maxLength}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={messagesFeatureConfig.composer.placeholder}
          rows={1}
          value={draft}
        />

        <div className="message-composer-meta">
          <span className="muted">
            {draft.length} / {messagesFeatureConfig.composer.maxLength}
          </span>

          <Button className="message-composer-submit" disabled={isSending || draft.trim().length === 0} type="submit">
            {isSending ? messagesFeatureConfig.messages.sending : messagesFeatureConfig.messages.sendButton}
          </Button>
        </div>
      </form>
    </Card>
  );
}