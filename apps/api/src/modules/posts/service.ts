import { AppError } from "../../core/errors/app-error";
import { postsConfig } from "./config";
import type { CreatePostInput, PostMediaPayload, PostsContext, PostsRepository } from "./types";

function readMediaExtension(contentType: string) {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    default:
      throw new AppError({
        statusCode: 400,
        code: "POST_MEDIA_TYPE_INVALID",
        message: "Gorsel dosya tipi desteklenmiyor."
      });
  }
}

function readMediaBuffer(media: PostMediaPayload) {
  const match = media.dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match || match[1] !== media.contentType) {
    throw new AppError({
      statusCode: 400,
      code: "POST_MEDIA_DATA_INVALID",
      message: "Gorsel verisi gecersiz gonderildi."
    });
  }

  const fileBuffer = Buffer.from(match[2], "base64");

  if (fileBuffer.length === 0 || fileBuffer.length > postsConfig.limits.mediaMaxBytes) {
    throw new AppError({
      statusCode: 400,
      code: "POST_MEDIA_SIZE_INVALID",
      message: "Gorsel boyutu izin verilen limiti asti."
    });
  }

  return fileBuffer;
}

function normalizeContent(input: CreatePostInput) {
  // Icerigi HTML olarak islemiyoruz; duz metin ve kod olarak tasiyip temel kontrol karakterlerini temizliyoruz.
  return input.content.replace(/\r\n/g, "\n").split(String.fromCharCode(0)).join("").trim();
}

function validateCreateInput(input: CreatePostInput) {
  const normalizedContent = normalizeContent(input);

  if ((input.postType === "text" || input.postType === "code") && normalizedContent.length === 0) {
    throw new AppError({
      statusCode: 400,
      code: "POST_CONTENT_REQUIRED",
      message: "Bu post tipi icin icerik bos olamaz."
    });
  }

  if (input.postType === "code" && !input.codeLanguage) {
    throw new AppError({
      statusCode: 400,
      code: "POST_CODE_LANGUAGE_REQUIRED",
      message: "Kod postu icin dil secmelisin."
    });
  }

  if (input.postType === "image" && !input.media) {
    throw new AppError({
      statusCode: 400,
      code: "POST_MEDIA_REQUIRED",
      message: "Gorsel post icin medya secmelisin."
    });
  }

  return normalizedContent;
}

export function createPostsService(repository: PostsRepository) {
  return {
    async getPostsByProfileId(context: PostsContext, profileId: string) {
      return repository.findPostsByProfileId(context, profileId);
    },

    async createPost(context: PostsContext, input: CreatePostInput) {
      const normalizedContent = validateCreateInput(input);
      const media = input.media
        ? {
            contentType: input.media.contentType,
            fileBuffer: readMediaBuffer(input.media),
            mediaPath: `${context.userId}/post-${Date.now()}.${readMediaExtension(input.media.contentType)}`
          }
        : null;

      const post = await repository.createPost(context, {
        postType: input.postType,
        content: normalizedContent,
        codeLanguage: input.postType === "code" ? input.codeLanguage : null,
        media
      });

      if (!post) {
        throw new AppError({
          statusCode: 404,
          code: "POST_AUTHOR_NOT_FOUND",
          message: "Paylasim sahibi bulunamadi."
        });
      }

      return post;
    },

    async deleteMyPost(context: PostsContext, postId: string) {
      const post = await repository.findPostById(context, postId);

      if (!post) {
        throw new AppError({
          statusCode: 404,
          code: "POST_NOT_FOUND",
          message: "Paylasim kaydi bulunamadi."
        });
      }

      if (!post.isOwner) {
        throw new AppError({
          statusCode: 403,
          code: "POST_DELETE_FORBIDDEN",
          message: "Sadece kendi paylasimini silebilirsin."
        });
      }

      await repository.deletePost(context, post);

      return post;
    }
  };
}