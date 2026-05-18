"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedFeatureConfig } from "@web/features/feed/config";
import { viewerFeatureConfig } from "@web/features/viewer/config";
import { followProfile, getMyProfile, getProfileById, searchProfiles, unfollowProfile, updateMyProfile, uploadMyAvatar } from "./api";
import { profileFeatureConfig } from "./config";
import type { ProfileView, UpdateMyProfileInput, UploadAvatarInput } from "./types";

function syncProfileCache(queryClient: ReturnType<typeof useQueryClient>, profile: ProfileView) {
  queryClient.setQueryData(profileFeatureConfig.queryKeys.detail(profile.id), profile);

  if (profile.isOwner) {
    queryClient.setQueryData(profileFeatureConfig.queryKeys.me, profile);
  }

  void queryClient.invalidateQueries({ queryKey: profileFeatureConfig.queryKeys.root });
  void queryClient.invalidateQueries({ queryKey: feedFeatureConfig.queryKeys.root });
  void queryClient.invalidateQueries({ queryKey: viewerFeatureConfig.queryKeys.me });
}

export function useMyProfileQuery(enabled = true) {
  return useQuery({
    queryKey: profileFeatureConfig.queryKeys.me,
    queryFn: getMyProfile,
    enabled
  });
}

export function useProfileQuery(profileId: string, enabled = true) {
  return useQuery({
    queryKey: profileFeatureConfig.queryKeys.detail(profileId),
    queryFn: () => getProfileById(profileId),
    enabled: enabled && profileId.length > 0
  });
}

export function useProfileSearchQuery(query: string, enabled = true) {
  return useQuery({
    queryKey: profileFeatureConfig.queryKeys.search(query),
    queryFn: () => searchProfiles(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: 30_000
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMyProfileInput) => updateMyProfile(input),
    onSuccess(profile) {
      syncProfileCache(queryClient, profile);
    }
  });
}

export function useUploadMyAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UploadAvatarInput) => uploadMyAvatar(input),
    onSuccess(profile) {
      syncProfileCache(queryClient, profile);
    }
  });
}

export function useFollowProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => followProfile(profileId),
    onSuccess(profile) {
      syncProfileCache(queryClient, profile);
    }
  });
}

export function useUnfollowProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => unfollowProfile(profileId),
    onSuccess(profile) {
      syncProfileCache(queryClient, profile);
    }
  });
}