import type { PostStatsView, PostType } from "@web/features/posts/types";

export type FeedMode = "following" | "global";

export type FeedCursor = {
  createdAt: string;
  id: string;
};

export type FeedAuthor = {
  id: string;
  username: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

export type FeedItemView = {
  id: string;
  userId: string;
  content: string;
  mediaPath: string | null;
  mediaUrl: string | null;
  codeLanguage: string | null;
  postType: PostType;
  createdAt: string;
  isOwner: boolean;
  isLiked: boolean;
  author: FeedAuthor;
  stats: PostStatsView;
};

export type FeedPage = {
  items: FeedItemView[];
  nextCursor: FeedCursor | null;
};