import { apiRequest } from "@web/lib/api-client";
import { postsFeatureConfig } from "./config";
import type { CreatePostInput, PostView } from "./types";

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