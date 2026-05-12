"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedFeatureConfig } from "@web/features/feed/config";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { viewerFeatureConfig } from "@web/features/viewer/config";
import { createPost, deletePost, getPostsByProfileId } from "./api";
import { postsFeatureConfig } from "./config";
import type { CreatePostInput, PostView } from "./types";

function syncPostCache(queryClient: ReturnType<typeof useQueryClient>, post: PostView) {
  void queryClient.invalidateQueries({ queryKey: feedFeatureConfig.queryKeys.root });
  void queryClient.invalidateQueries({ queryKey: postsFeatureConfig.queryKeys.root });
  void queryClient.invalidateQueries({ queryKey: profileFeatureConfig.queryKeys.root });
  void queryClient.invalidateQueries({ queryKey: viewerFeatureConfig.queryKeys.me });

  if (post.userId) {
    void queryClient.invalidateQueries({ queryKey: postsFeatureConfig.queryKeys.byProfile(post.userId) });
  }
}

export function usePostsByProfileQuery(profileId: string, enabled = true) {
  return useQuery({
    queryKey: postsFeatureConfig.queryKeys.byProfile(profileId),
    queryFn: () => getPostsByProfileId(profileId),
    enabled: enabled && profileId.length > 0
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess(post) {
      syncPostCache(queryClient, post);
    }
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess(post) {
      syncPostCache(queryClient, post);
    }
  });
}