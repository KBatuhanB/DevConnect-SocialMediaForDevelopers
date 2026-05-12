import { AppError } from "../../core/errors/app-error";
import { profilesConfig } from "./config";
import type { ProfileView, ProfilesContext, ProfilesRepository, UpdateMyProfileInput, UploadAvatarInput } from "./types";

function buildProfileNotFoundError() {
  return new AppError({
    statusCode: 404,
    code: "PROFILE_NOT_FOUND",
    message: "Profil kaydi bulunamadi."
  });
}

function normalizeUpdateInput(input: UpdateMyProfileInput): UpdateMyProfileInput {
  const seenSkills = new Set<string>();

  return {
    bio: input.bio.trim(),
    // Aynı etiketi farkli yazimlarla ikinci kez kaydetmiyoruz.
    skills: input.skills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .filter((skill) => {
        const normalizedSkill = skill.toLowerCase();

        if (seenSkills.has(normalizedSkill)) {
          return false;
        }

        seenSkills.add(normalizedSkill);
        return true;
      })
      .slice(0, profilesConfig.limits.skillMaxCount)
  };
}

async function readProfileOrThrow(repository: ProfilesRepository, context: ProfilesContext, profileId: string) {
  const profile = await repository.findProfileById(context, profileId);

  if (!profile) {
    throw buildProfileNotFoundError();
  }

  return profile;
}

function assertTargetIsNotSelf(context: ProfilesContext, profileId: string) {
  if (context.userId === profileId) {
    throw new AppError({
      statusCode: 400,
      code: "PROFILE_SELF_FOLLOW_NOT_ALLOWED",
      message: "Kendini takip edemezsin."
    });
  }
}

function readAvatarExtension(contentType: string) {
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
        code: "PROFILE_AVATAR_TYPE_INVALID",
        message: "Avatar dosya tipi desteklenmiyor."
      });
  }
}

function readAvatarPayload(input: UploadAvatarInput) {
  const match = input.dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new AppError({
      statusCode: 400,
      code: "PROFILE_AVATAR_DATA_INVALID",
      message: "Avatar verisi gecersiz gonderildi."
    });
  }

  if (match[1] !== input.contentType) {
    throw new AppError({
      statusCode: 400,
      code: "PROFILE_AVATAR_TYPE_MISMATCH",
      message: "Avatar veri tipi uyusmuyor."
    });
  }

  const fileBuffer = Buffer.from(match[2], "base64");

  if (fileBuffer.length === 0 || fileBuffer.length > profilesConfig.limits.avatarMaxBytes) {
    throw new AppError({
      statusCode: 400,
      code: "PROFILE_AVATAR_SIZE_INVALID",
      message: "Avatar boyutu izin verilen limiti asti."
    });
  }

  return fileBuffer;
}

export function createProfilesService(repository: ProfilesRepository) {
  return {
    async getMyProfile(context: ProfilesContext) {
      return readProfileOrThrow(repository, context, context.userId);
    },

    async getProfileById(context: ProfilesContext, profileId: string) {
      return readProfileOrThrow(repository, context, profileId);
    },

    async updateMyProfile(context: ProfilesContext, input: UpdateMyProfileInput): Promise<ProfileView> {
      const normalizedInput = normalizeUpdateInput(input);
      const profile = await repository.updateMyProfile(context, normalizedInput);

      if (!profile) {
        throw buildProfileNotFoundError();
      }

      return profile;
    },

    async followProfile(context: ProfilesContext, profileId: string) {
      assertTargetIsNotSelf(context, profileId);
      await readProfileOrThrow(repository, context, profileId);
      await repository.followProfile(context, profileId);

      return readProfileOrThrow(repository, context, profileId);
    },

    async unfollowProfile(context: ProfilesContext, profileId: string) {
      assertTargetIsNotSelf(context, profileId);
      await readProfileOrThrow(repository, context, profileId);
      await repository.unfollowProfile(context, profileId);

      return readProfileOrThrow(repository, context, profileId);
    },

    async uploadMyAvatar(context: ProfilesContext, input: UploadAvatarInput) {
      const currentProfile = await readProfileOrThrow(repository, context, context.userId);
      const fileBuffer = readAvatarPayload(input);
      const extension = readAvatarExtension(input.contentType);

      // Her yeni avatar icin benzersiz yol uretip stale public cache riskini azaltıyoruz.
      const nextAvatarPath = `${context.userId}/avatar-${Date.now()}.${extension}`;
      const profile = await repository.replaceAvatar(context, {
        contentType: input.contentType,
        currentAvatarPath: currentProfile.avatarPath,
        nextAvatarPath,
        fileBuffer
      });

      if (!profile) {
        throw buildProfileNotFoundError();
      }

      return profile;
    }
  };
}