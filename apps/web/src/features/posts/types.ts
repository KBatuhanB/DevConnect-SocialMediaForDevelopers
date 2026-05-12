export type PostType = "text" | "code" | "image";

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

export type CreatePostInput = {
  postType: PostType;
  content: string;
  codeLanguage: string | null;
  media: {
    contentType: string;
    dataUrl: string;
  } | null;
};