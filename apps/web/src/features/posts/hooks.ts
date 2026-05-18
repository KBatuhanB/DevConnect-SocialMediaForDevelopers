"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedFeatureConfig } from "@web/features/feed/config";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { viewerFeatureConfig } from "@web/features/viewer/config";
import { createPost, createPostComment, deletePost, getPostComments, getPostsByProfileId, likePost, unlikePost } from "./api";
import { postsFeatureConfig } from "./config";
import type { CreatePostCommentResult, CreatePostInput, PostView } from "./types";

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

export function usePostCommentsQuery(postId: string, enabled = true) {
  return useQuery({
    queryKey: postsFeatureConfig.queryKeys.comments(postId),
    queryFn: () => getPostComments(postId),
    enabled: enabled && postId.length > 0
  });
}

export function useTogglePostLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => (isLiked ? unlikePost(postId) : likePost(postId)),
    onSuccess(post) {
      syncPostCache(queryClient, post);
    }
  });
}

export function useCreatePostCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => createPostComment(postId, { content }),
    onSuccess(result: CreatePostCommentResult) {
      syncPostCache(queryClient, result.post);
      void queryClient.invalidateQueries({ queryKey: postsFeatureConfig.queryKeys.comments(result.post.id) });
    }
  });
}