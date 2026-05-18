import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { errorCodes } from "../../core/errors/error-codes";
import { sendSuccess } from "../../core/http/response";
import { mapValidationError } from "../../core/http/validation";
import type { UpdateMyProfileInput, UploadAvatarInput } from "./types";
import { profileParamsSchema, searchProfilesQuerySchema, updateMyProfileSchema, uploadAvatarSchema } from "./validation";

type ProfilesService = {
  getMyProfile: (context: { accessToken: string; userId: string }) => Promise<unknown>;
  searchProfiles: (context: { accessToken: string; userId: string }, query: string) => Promise<unknown>;
  getProfileById: (context: { accessToken: string; userId: string }, profileId: string) => Promise<unknown>;
  updateMyProfile: (context: { accessToken: string; userId: string }, input: UpdateMyProfileInput) => Promise<unknown>;
  followProfile: (context: { accessToken: string; userId: string }, profileId: string) => Promise<unknown>;
  unfollowProfile: (context: { accessToken: string; userId: string }, profileId: string) => Promise<unknown>;
  uploadMyAvatar: (context: { accessToken: string; userId: string }, input: UploadAvatarInput) => Promise<unknown>;
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

export function createProfilesController(service: ProfilesService) {
  return {
    getMyProfile: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const profile = await service.getMyProfile(readRequestContext(request));

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    },

    searchProfiles: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedQuery = searchProfilesQuerySchema.safeParse(request.query);

        if (!parsedQuery.success) {
          next(mapValidationError(parsedQuery.error));
          return;
        }

        const profiles = await service.searchProfiles(readRequestContext(request), parsedQuery.data.query);

        sendSuccess(response, {
          profiles
        });
      } catch (error) {
        next(error);
      }
    },

    getProfileById: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = profileParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const profile = await service.getProfileById(readRequestContext(request), parsedParams.data.profileId);

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    },

    updateMyProfile: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedBody = updateMyProfileSchema.safeParse(request.body);

        if (!parsedBody.success) {
          next(mapValidationError(parsedBody.error));
          return;
        }

        const profile = await service.updateMyProfile(readRequestContext(request), parsedBody.data);

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    },

    followProfile: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = profileParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const profile = await service.followProfile(readRequestContext(request), parsedParams.data.profileId);

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    },

    unfollowProfile: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedParams = profileParamsSchema.safeParse(request.params);

        if (!parsedParams.success) {
          next(mapValidationError(parsedParams.error));
          return;
        }

        const profile = await service.unfollowProfile(readRequestContext(request), parsedParams.data.profileId);

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    },

    uploadMyAvatar: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const parsedBody = uploadAvatarSchema.safeParse(request.body);

        if (!parsedBody.success) {
          next(mapValidationError(parsedBody.error));
          return;
        }

        const profile = await service.uploadMyAvatar(readRequestContext(request), parsedBody.data);

        sendSuccess(response, {
          profile
        });
      } catch (error) {
        next(error);
      }
    }
  };
}