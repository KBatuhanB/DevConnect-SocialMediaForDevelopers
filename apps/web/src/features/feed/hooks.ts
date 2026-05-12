"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedPage } from "./api";
import { feedFeatureConfig } from "./config";
import type { FeedCursor } from "./types";

export function useFeedInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: feedFeatureConfig.queryKeys.main,
    queryFn: ({ pageParam }) => getFeedPage(pageParam as FeedCursor | null),
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
}