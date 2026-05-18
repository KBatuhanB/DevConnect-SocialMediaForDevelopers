"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedPage } from "./api";
import { feedFeatureConfig } from "./config";
import type { FeedCursor, FeedMode } from "./types";

export function useFeedInfiniteQuery(mode: FeedMode) {
  return useInfiniteQuery({
    queryKey: feedFeatureConfig.queryKeys.main(mode),
    queryFn: ({ pageParam }) => getFeedPage(mode, pageParam as FeedCursor | null),
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
}