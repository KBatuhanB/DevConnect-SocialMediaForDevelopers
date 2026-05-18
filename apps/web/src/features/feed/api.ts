import { apiRequest } from "@web/lib/api-client";
import { feedFeatureConfig } from "./config";
import type { FeedCursor, FeedMode, FeedPage } from "./types";

export async function getFeedPage(mode: FeedMode, cursor: FeedCursor | null) {
  const searchParams = new URLSearchParams();

  searchParams.set("mode", mode);

  if (cursor) {
    searchParams.set("cursorCreatedAt", cursor.createdAt);
    searchParams.set("cursorId", cursor.id);
  }

  const path = searchParams.size > 0 ? `${feedFeatureConfig.api.mainPath}?${searchParams.toString()}` : feedFeatureConfig.api.mainPath;
  const payload = await apiRequest<{ page: FeedPage }>(path, {
    method: "GET"
  });

  return payload.page;
}