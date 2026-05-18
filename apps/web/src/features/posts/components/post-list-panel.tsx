"use client";

import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { readApiErrorMessage } from "@web/lib/api-client";
import { PostInteractions } from "./post-interactions";
import { postsFeatureConfig } from "../config";
import { useDeletePostMutation, usePostsByProfileQuery } from "../hooks";

type PostListPanelProps = {
  profileId: string;
  title: string;
  description: string;
};

function formatPostDate(createdAt: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(createdAt));
}

export function PostListPanel({ profileId, title, description }: PostListPanelProps) {
  const { pushToast } = useToast();
  const postsQuery = usePostsByProfileQuery(profileId, profileId.length > 0);
  const deletePostMutation = useDeletePostMutation();

  async function handleDelete(postId: string) {
    try {
      await deletePostMutation.mutateAsync(postId);
      pushToast({
        tone: "success",
        title: "Paylaşım silindi",
        description: postsFeatureConfig.messages.deleteSuccess
      });
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Paylaşım silinemedi",
        description: readApiErrorMessage(error)
      });
    }
  }

  if (postsQuery.isLoading) {
    return (
      <Card className="profile-card post-list-card">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-block" />
      </Card>
    );
  }

  if (postsQuery.isError) {
    return (
      <EmptyState
        actionLabel="Tekrar dene"
        description={postsFeatureConfig.messages.loadError}
        eyebrow="Paylaşımlar"
        onAction={() => void postsQuery.refetch()}
        title="Paylaşımlar şu an okunmuyor"
      />
    );
  }

  if (!postsQuery.data || postsQuery.data.length === 0) {
    return (
      <EmptyState description={description} eyebrow={null} showOrbit={false} title={title} />
    );
  }

  return (
    <Card className="profile-card post-list-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Paylaşımlar</p>
          <h2>{title}</h2>
        </div>
          <span className="chip">{postsQuery.data.length} kayıt</span>
      </div>

      <div className="post-list-stack">
        {postsQuery.data.map((post) => (
          <article className="post-item" key={post.id}>
            <div className="post-item-header">
              <div>
                <strong>{post.postType}</strong>
                <p className="muted">{formatPostDate(post.createdAt)}</p>
              </div>
              <div className="action-row">
                {post.codeLanguage ? <span className="chip">{post.codeLanguage}</span> : null}
                {post.isOwner ? (
                  <Button disabled={deletePostMutation.isPending} onClick={() => void handleDelete(post.id)} type="button" variant="secondary">
                    Sil
                  </Button>
                ) : null}
              </div>
            </div>

            {post.postType === "image" && post.mediaUrl ? <img alt="Post görseli" className="post-media-preview" src={post.mediaUrl} /> : null}
            {post.postType === "code" ? (
              <pre className="code-preview-block post-code-block">
                <code>{post.content}</code>
              </pre>
            ) : post.content ? (
              <p className="lead-copy">{post.content}</p>
            ) : null}

            <PostInteractions isLiked={post.isLiked} postId={post.id} stats={post.stats} />
          </article>
        ))}
      </div>
    </Card>
  );
}