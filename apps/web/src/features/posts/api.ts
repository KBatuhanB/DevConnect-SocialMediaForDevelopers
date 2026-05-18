import { apiRequest } from "@web/lib/api-client";
import { postsFeatureConfig } from "./config";
import type { CreatePostCommentInput, CreatePostCommentResult, CreatePostInput, PostCommentView, PostView } from "./types";

export async function getPostsByProfileId(profileId: string) {
  const payload = await apiRequest<{ posts: PostView[] }>(postsFeatureConfig.api.byProfilePath(profileId), {
    method: "GET"
  });

  return payload.posts;
}

export async function createPost(input: CreatePostInput) {
  const payload = await apiRequest<{ post: PostView }>(postsFeatureConfig.api.createPath, {
    method: "POST",
    body: JSON.stringify(input)
  });

  return payload.post;
}

export async function deletePost(postId: string) {
  const payload = await apiRequest<{ post: PostView }>(postsFeatureConfig.api.detailPath(postId), {
    method: "DELETE"
  });

  return payload.post;
}

export async function likePost(postId: string) {
  const payload = await apiRequest<{ post: PostView }>(postsFeatureConfig.api.likesPath(postId), {
    method: "POST"
  });

  return payload.post;
}

export async function unlikePost(postId: string) {
  const payload = await apiRequest<{ post: PostView }>(postsFeatureConfig.api.likesPath(postId), {
    method: "DELETE"
  });

  return payload.post;
}

export async function getPostComments(postId: string) {
  const payload = await apiRequest<{ comments: PostCommentView[] }>(postsFeatureConfig.api.commentsPath(postId), {
    method: "GET"
  });

  return payload.comments;
}

export async function createPostComment(postId: string, input: CreatePostCommentInput) {
  const payload = await apiRequest<CreatePostCommentResult>(postsFeatureConfig.api.commentsPath(postId), {
    method: "POST",
    body: JSON.stringify(input)
  });

  return payload;
}