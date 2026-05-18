export type PostType = "text" | "code" | "image";

export type PostStatsView = {
  likes: number;
  comments: number;
};

export type PostCommentAuthorView = {
  id: string;
  username: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

export type PostCommentView = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
  author: PostCommentAuthorView;
};

export type PostView = {
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
  stats: PostStatsView;
};

export type CreatePostCommentInput = {
  content: string;
};

export type CreatePostCommentResult = {
  comment: PostCommentView;
  post: PostView;
};

export type CreatePostInput = {
  postType: PostType;
  content: string;
  codeLanguage: string | null;
  media: {
    contentType: string;
    dataUrl: string;
  } | null;
};