"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Textarea } from "@web/components/ui/textarea";
import { readApiErrorMessage } from "@web/lib/api-client";
import { cn } from "@web/lib/cn";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { postsFeatureConfig } from "../config";
import { useCreatePostCommentMutation, usePostCommentsQuery, useTogglePostLikeMutation } from "../hooks";
import type { PostStatsView } from "../types";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="interaction-icon"
      fill={filled ? "currentColor" : "none"}
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      className="interaction-icon"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

type PostInteractionsProps = {
  postId: string;
  isLiked: boolean;
  stats: PostStatsView;
};

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

function formatCommentDate(createdAt: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(createdAt));
}

export function PostInteractions({ postId, isLiked, stats }: PostInteractionsProps) {
  const { pushToast } = useToast();
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [draftComment, setDraftComment] = useState("");
  const commentsQuery = usePostCommentsQuery(postId, isCommentsOpen);
  const toggleLikeMutation = useTogglePostLikeMutation();
  const createCommentMutation = useCreatePostCommentMutation();

  async function handleToggleLike() {
    try {
      await toggleLikeMutation.mutateAsync({
        postId,
        isLiked
      });

      pushToast({
        tone: "success",
        title: isLiked ? "Beğeni kaldırıldı" : "Paylaşım beğenildi",
        description: isLiked ? postsFeatureConfig.messages.unlikeSuccess : postsFeatureConfig.messages.likeSuccess
      });
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Beğeni güncellenemedi",
        description: readApiErrorMessage(error)
      });
    }
  }

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: draftComment
      });
      setDraftComment("");

      pushToast({
        tone: "success",
        title: "Yorum gönderildi",
        description: postsFeatureConfig.messages.commentSuccess
      });
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Yorum gönderilemedi",
        description: readApiErrorMessage(error)
      });
    }
  }

  return (
    <div className="post-interaction-shell">
      <div className="post-interaction-row">
        <Button
          aria-label={`${stats.likes} beğeni${isLiked ? ", beğenildi" : ""}`}
          aria-pressed={isLiked}
          className={cn("post-interaction-button", isLiked && "post-interaction-button-liked")}
          disabled={toggleLikeMutation.isPending}
          onClick={() => void handleToggleLike()}
          type="button"
          variant="ghost"
        >
          <HeartIcon filled={isLiked} />
          <span className="interaction-count">{stats.likes}</span>
        </Button>

        <Button
          aria-expanded={isCommentsOpen}
          aria-label={`${stats.comments} yorum`}
          className={cn("post-interaction-button", isCommentsOpen && "post-interaction-button-active")}
          onClick={() => setCommentsOpen((current) => !current)}
          type="button"
          variant="ghost"
        >
          <CommentIcon />
          <span className="interaction-count">{stats.comments}</span>
        </Button>
      </div>

      {isCommentsOpen ? (
        <div className="post-comments-panel">
          {commentsQuery.isLoading ? <p className="muted post-comments-status">Yorumlar yükleniyor...</p> : null}
          {commentsQuery.isError ? <p className="post-comments-status post-comments-status-error">{postsFeatureConfig.messages.commentsLoadError}</p> : null}
          {commentsQuery.data && commentsQuery.data.length === 0 ? <p className="muted post-comments-status">{postsFeatureConfig.messages.emptyComments}</p> : null}

          {commentsQuery.data && commentsQuery.data.length > 0 ? (
            <div className="post-comments-list">
              {commentsQuery.data.map((comment) => (
                <article className="post-comment-item" key={comment.id}>
                  <Link className="post-comment-author" href={profileFeatureConfig.paths.detail(comment.author.id)}>
                    <div className="post-comment-avatar" aria-hidden="true">
                      {comment.author.avatarUrl ? (
                        <img alt={`${comment.author.username} avatar`} className="post-comment-avatar-image" src={comment.author.avatarUrl} />
                      ) : (
                        <span>{readInitial(comment.author.username)}</span>
                      )}
                    </div>
                    <div>
                      <strong>{comment.author.username}</strong>
                      <p className="muted">{formatCommentDate(comment.createdAt)}</p>
                    </div>
                  </Link>

                  <p className="post-comment-copy">{comment.content}</p>
                </article>
              ))}
            </div>
          ) : null}

          <form className="post-comment-form" onSubmit={handleCommentSubmit}>
            <Textarea
              className="post-comment-textarea"
              maxLength={postsFeatureConfig.limits.commentMaxLength}
              onChange={(event) => setDraftComment(event.target.value)}
              placeholder="Paylaşıma yorum ekle"
              rows={3}
              value={draftComment}
            />
            <div className="post-comment-form-footer">
              <small className="muted">{draftComment.trim().length}/{postsFeatureConfig.limits.commentMaxLength}</small>
              <Button disabled={createCommentMutation.isPending || draftComment.trim().length === 0} type="submit" variant="secondary">
                Yorum gönder
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}