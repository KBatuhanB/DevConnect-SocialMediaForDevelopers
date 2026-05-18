import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendSuccess } from "../../core/http/response";
import { mapValidationError } from "../../core/http/validation";
import { createPostCommentSchema, createPostSchema, postParamsSchema, profilePostsParamsSchema } from "./validation";

type PostsService = {
  getPostsByProfileId: (context: { accessToken: string; userId: string }, profileId: string) => Promise<unknown>;
  getCommentsByPostId: (context: { accessToken: string; userId: string }, postId: string) => Promise<unknown>;
  createPost: (context: { accessToken: string; userId: string }, input: {
    postType: "text" | "code" | "image";
    content: string;
    codeLanguage: string | null;
    media: { contentType: string; dataUrl: string } | null;
  }) => Promise<unknown>;
  createComment: (context: { accessToken: string; userId: string }, postId: string, input: {
    content: string;
  }) => Promise<unknown>;
  likePost: (context: { accessToken: string; userId: string }, postId: string) => Promise<unknown>;
  unlikePost: (context: { accessToken: string; userId: string }, postId: string) => Promise<unknown>;
  deleteMyPost: (context: { accessToken: string; userId: string }, postId: string) => Promise<unknown>;
};

function readRequestContext(request: Request) {
  if (!request.user || !request.accessToken) {
    throw new AppError({
      statusCode: 401,
      code: errorCodes.authRequired,
      message: "Bu islem icin giris yapmalisin."
    });
  }

  return {
    accessToken: request.accessToken,
    userId: request.user.id
  };
}

export function createPostsController(service: PostsService) {
  return {
    getPostsByProfileId: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = profilePostsParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const posts = await service.getPostsByProfileId(readRequestContext(request), parsedParams.data.profileId);

        sendSuccess(response, {
          posts
        });
      } catch (error) {
        next(error);
      }
    },

    getCommentsByPostId: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = postParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const comments = await service.getCommentsByPostId(readRequestContext(request), parsedParams.data.postId);

        sendSuccess(response, {
          comments
        });
      } catch (error) {
        next(error);
      }
    },

    createPost: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedBody = createPostSchema.safeParse(request.body);

        if (!parsedBody.success) {
          next(mapValidationError(parsedBody.error));
          return;
        }

        const post = await service.createPost(readRequestContext(request), parsedBody.data);

        sendSuccess(response, {
          post
        }, 201);
      } catch (error) {
        next(error);
      }
    },

    createComment: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = postParamsSchema.safeParse(request.params);
        const parsedBody = createPostCommentSchema.safeParse(request.body);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        if (!parsedBody.success) {
          next(mapValidationError(parsedBody.error));
          return;
        }

        const result = await service.createComment(readRequestContext(request), parsedParams.data.postId, parsedBody.data);

        sendSuccess(response, result, 201);
      } catch (error) {
        next(error);
      }
    },

    likePost: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = postParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const post = await service.likePost(readRequestContext(request), parsedParams.data.postId);

        sendSuccess(response, {
          post
        });
      } catch (error) {
        next(error);
      }
    },

    unlikePost: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = postParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const post = await service.unlikePost(readRequestContext(request), parsedParams.data.postId);

        sendSuccess(response, {
          post
        });
      } catch (error) {
        next(error);
      }
    },

    deleteMyPost: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = postParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const post = await service.deleteMyPost(readRequestContext(request), parsedParams.data.postId);

        sendSuccess(response, {
          post
        });
      } catch (error) {
        next(error);
      }
    }
  };
}