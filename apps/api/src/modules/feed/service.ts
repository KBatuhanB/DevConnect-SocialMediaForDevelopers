import { feedConfig } from "./config";
import type { FeedContext, FeedCursor, FeedRepository } from "./types";

function dedupeFeedItems<T extends { id: string }>(items: T[]) {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
}

export function createFeedService(repository: FeedRepository) {
  return {
    async getFeedPage(context: FeedContext, cursor: FeedCursor | null) {
      const followingIds = await repository.findFollowingIds(context);
      const allowedUserIds = Array.from(new Set([context.userId, ...followingIds]));
      const candidates = await repository.findFeedCandidates(context, {
        allowedUserIds,
        cursor,
        limit: feedConfig.pagination.queryLimit
      });
      const dedupedItems = dedupeFeedItems(candidates);
      const hasMore = dedupedItems.length > feedConfig.pagination.pageSize;
      const items = hasMore ? dedupedItems.slice(0, feedConfig.pagination.pageSize) : dedupedItems;
      const lastItem = items[items.length - 1];

      return {
        items,
        nextCursor: hasMore && lastItem ? { createdAt: lastItem.createdAt, id: lastItem.id } : null
      };
    }
  };
}