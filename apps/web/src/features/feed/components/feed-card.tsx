"use client";

import Link from "next/link";
import { Card } from "@web/components/ui/card";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { feedFeatureConfig } from "../config";
import type { FeedItemView } from "../types";

function formatFeedDate(createdAt: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(createdAt));
}

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

export function FeedCard({ item }: { item: FeedItemView }) {
  return (
    <Card className="feed-card">
      <div className="feed-author-row">
        <Link className="feed-author-link" href={profileFeatureConfig.paths.detail(item.author.id)}>
          <div className="feed-avatar" aria-hidden="true">
            {item.author.avatarUrl ? <img alt={`${item.author.username} avatar`} className="feed-avatar-image" src={item.author.avatarUrl} /> : <span>{readInitial(item.author.username)}</span>}
          </div>

          <div>
            <strong>{item.author.username}</strong>
            <p className="muted">{formatFeedDate(item.createdAt)}</p>
          </div>
        </Link>

        <div className="chip-row feed-chip-row">
          <span className="chip">{item.postType}</span>
          {item.codeLanguage ? <span className="chip">{item.codeLanguage}</span> : null}
        </div>
      </div>

      {item.postType === "image" && item.mediaUrl ? <img alt="Feed gorseli" className="post-media-preview" src={item.mediaUrl} /> : null}

      {item.postType === "code" ? (
        <pre className="code-preview-block post-code-block">
          <code>{item.content}</code>
        </pre>
      ) : item.content ? (
        <p className="lead-copy">{item.content}</p>
      ) : null}

      <p className="muted feed-footer-note">{feedFeatureConfig.messages.interactionPlaceholder}</p>
    </Card>
  );
}