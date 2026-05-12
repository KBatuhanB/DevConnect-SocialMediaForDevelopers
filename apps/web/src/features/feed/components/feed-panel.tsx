"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { feedFeatureConfig } from "../config";
import { useFeedInfiniteQuery } from "../hooks";
import type { FeedItemView } from "../types";
import { FeedCard } from "./feed-card";

export function FeedPanel() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const feedQuery = useFeedInfiniteQuery();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = feedQuery;

  const items = useMemo(() => {
    const seenIds = new Set<string>();
    const resolvedItems: FeedItemView[] = [];

    for (const page of feedQuery.data?.pages ?? []) {
      for (const item of page.items) {
        if (seenIds.has(item.id)) {
          continue;
        }

        seenIds.add(item.id);
        resolvedItems.push(item);
      }
    }

    return resolvedItems;
  }, [feedQuery.data?.pages]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) {
          return;
        }

        void fetchNextPage();
      },
      {
        rootMargin: feedFeatureConfig.pagination.preloadRootMargin,
        threshold: feedFeatureConfig.pagination.threshold
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let content: ReactNode;

  if (feedQuery.isLoading) {
    content = (
      <div className="feed-stack">
        {Array.from({ length: feedFeatureConfig.pagination.skeletonCount }, (_, index) => (
          <div className="feed-card feed-card-skeleton" key={index}>
            <Skeleton className="skeleton-title" />
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-block" />
          </div>
        ))}
      </div>
    );
  } else if (feedQuery.isError) {
    content = (
      <EmptyState
        actionLabel="Tekrar dene"
        description={feedFeatureConfig.messages.loadError}
        onAction={() => void feedQuery.refetch()}
        title="Feed su an okunamiyor"
      />
    );
  } else if (items.length === 0) {
    content = (
      <EmptyState
        actionLabel="Profile git"
        description={feedFeatureConfig.messages.emptyDescription}
        onAction={() => {
          window.location.href = "/profile";
        }}
        title={feedFeatureConfig.messages.emptyTitle}
      />
    );
  } else {
    content = (
      <>
        <div className="feed-stack">
          {items.map((item) => (
            <FeedCard item={item} key={item.id} />
          ))}
        </div>

        <div className="feed-pagination-note" ref={sentinelRef}>
          {isFetchingNextPage
            ? feedFeatureConfig.messages.loadingMore
            : hasNextPage
              ? "Asagi indikce yeni kayitlar yuklenecek."
              : feedFeatureConfig.messages.endReached}
        </div>
      </>
    );
  }

  return (
    <section className="feed-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Faz 9 feed</p>
          <h2>{feedFeatureConfig.messages.title}</h2>
        </div>
        <span className="chip">{items.length} kart</span>
      </div>

      {content}
    </section>
  );
}