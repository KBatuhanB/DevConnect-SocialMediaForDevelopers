export type PostType = "text" | "code" | "image";

export type PostsContext = {
  accessToken: string;
  userId: string;
};

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

export type PostMediaPayload = {
  contentType: string;
  dataUrl: string;
};

export type CreatePostInput = {
  postType: PostType;
  content: string;
  codeLanguage: string | null;
  media: PostMediaPayload | null;
};

export type CreatePostCommentInput = {
  content: string;
};

export type PreparedCreatePostInput = {
  postType: PostType;
  content: string;
  codeLanguage: string | null;
  media:
    | {
        contentType: string;
        fileBuffer: Buffer;
        mediaPath: string;
      }
    | null;
};

export type PostsRepository = {
  findPostsByProfileId: (context: PostsContext, profileId: string) => Promise<PostView[]>;
  findPostById: (context: PostsContext, postId: string) => Promise<PostView | null>;
  findCommentsByPostId: (context: PostsContext, postId: string) => Promise<PostCommentView[]>;
  createPost: (context: PostsContext, input: PreparedCreatePostInput) => Promise<PostView | null>;
  createComment: (context: PostsContext, postId: string, content: string) => Promise<PostCommentView | null>;
  addLike: (context: PostsContext, postId: string) => Promise<void>;
  removeLike: (context: PostsContext, postId: string) => Promise<void>;
  deletePost: (context: PostsContext, post: PostView) => Promise<void>;
};