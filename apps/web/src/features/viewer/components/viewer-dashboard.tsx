"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@web/components/ui/empty-state";
import { Skeleton } from "@web/components/ui/skeleton";
import { Card } from "@web/components/ui/card";
import { Dialog } from "@web/components/ui/dialog";
import { designSystemConfig } from "@web/features/design-system/config";
import { FeedPanel } from "@web/features/feed/components/feed-panel";
import { PostComposer } from "@web/features/posts/components/post-composer";
import { useViewerProfileQuery } from "../hooks";
import { viewerFeatureConfig } from "../config";

export function ViewerDashboard() {
  const [isGuideOpen, setGuideOpen] = useState(false);
  const viewerQuery = useViewerProfileQuery();

  if (viewerQuery.isLoading) {
    return (
      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
        </Card>
        <Card className="dashboard-card">
          <Skeleton className="skeleton-block" />
        </Card>
      </div>
    );
  }

  if (viewerQuery.isError) {
    return (
      <EmptyState
        actionLabel="Tekrar dene"
        description="API verisi okunurken bir hata oldu. Shell calisiyor ama veri istegi tekrar denenmeli."
        onAction={() => void viewerQuery.refetch()}
        title="Profil verisi su an okunamiyor"
      />
    );
  }

  if (!viewerQuery.data) {
    return (
      <EmptyState
        description={viewerFeatureConfig.emptyState.description}
        title={viewerFeatureConfig.emptyState.title}
      />
    );
  }

  return (
    <>
      <div className="dashboard-grid">
        <Card accent className="dashboard-card profile-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Profil ozeti</p>
              <h1>{viewerQuery.data.username}</h1>
            </div>
            <Link className="ui-link" href="/profile">
              Profili ac
            </Link>
          </div>

          <p className="lead-copy">
            {viewerQuery.data.bio || designSystemConfig.placeholders.viewerBioFallback}
          </p>

          <div className="chip-row">
            {viewerQuery.data.skills.length > 0 ? (
              viewerQuery.data.skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="chip">etiket yok</span>
            )}
          </div>
        </Card>

        <PostComposer />
      </div>

      <FeedPanel />

      <Dialog
        description="Bu dialog, sonraki fazlardaki modal ihtiyaclari icin ortak bir temel verir."
        onClose={() => setGuideOpen(false)}
        open={isGuideOpen}
        title="Faz 9 feed rehberi"
      >
        <ul className="modal-note-list">
          {designSystemConfig.shell.quickNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Dialog>
    </>
  );
}