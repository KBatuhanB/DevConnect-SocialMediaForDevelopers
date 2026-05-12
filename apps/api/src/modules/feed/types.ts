import type { PostType } from "../posts/types";

export type FeedContext = {
  accessToken: string;
  userId: string;
};

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
  author: FeedAuthor;
  stats: {
    likes: number;
    comments: number;
  };
};

export type FeedPage = {
  items: FeedItemView[];
  nextCursor: FeedCursor | null;
};

export type FeedRepository = {
  findFollowingIds: (context: FeedContext) => Promise<string[]>;
  findFeedCandidates: (
    context: FeedContext,
    input: {
      allowedUserIds: string[];
      cursor: FeedCursor | null;
      limit: number;
    }
  ) => Promise<FeedItemView[]>;
};