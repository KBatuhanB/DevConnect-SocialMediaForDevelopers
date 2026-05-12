import { apiRequest } from "@web/lib/api-client";
import { profileFeatureConfig } from "./config";
import type { ProfileView, UpdateMyProfileInput, UploadAvatarInput } from "./types";

export async function getMyProfile() {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.mePath, {
    method: "GET"
  });

  return payload.profile;
}

export async function getProfileById(profileId: string) {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.detailPath(profileId), {
    method: "GET"
  });

  return payload.profile;
}

export async function updateMyProfile(input: UpdateMyProfileInput) {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.mePath, {
    method: "PATCH",
    body: JSON.stringify(input)
  });

  return payload.profile;
}

export async function uploadMyAvatar(input: UploadAvatarInput) {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.avatarPath, {
    method: "POST",
    body: JSON.stringify(input)
  });

  return payload.profile;
}

export async function followProfile(profileId: string) {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.followPath(profileId), {
    method: "POST"
  });

  return payload.profile;
}

export async function unfollowProfile(profileId: string) {
  const payload = await apiRequest<{ profile: ProfileView }>(profileFeatureConfig.api.followPath(profileId), {
    method: "DELETE"
  });

  return payload.profile;
}