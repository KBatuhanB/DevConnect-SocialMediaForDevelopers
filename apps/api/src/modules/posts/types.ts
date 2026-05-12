export type PostType = "text" | "code" | "image";

export type PostsContext = {
  accessToken: string;
  userId: string;
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
  createPost: (context: PostsContext, input: PreparedCreatePostInput) => Promise<PostView | null>;
  deletePost: (context: PostsContext, post: PostView) => Promise<void>;
};