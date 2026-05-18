"use client";

import { FeedPanel } from "@web/features/feed/components/feed-panel";
import type { FeedMode } from "@web/features/feed/types";

export function ViewerDashboard({ mode }: { mode: FeedMode }) {
  return (
    <div className="feed-page-main">
      <FeedPanel mode={mode} />
    </div>
  );
}