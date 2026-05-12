"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { EmptyState } from "@web/components/ui/empty-state";
import { Input } from "@web/components/ui/input";
import { Skeleton } from "@web/components/ui/skeleton";
import { Textarea } from "@web/components/ui/textarea";
import { PostListPanel } from "@web/features/posts/components/post-list-panel";
import { postsFeatureConfig } from "@web/features/posts/config";
import { messagesFeatureConfig } from "@web/features/messages/config";
import { ApiClientError, readApiErrorMessage } from "@web/lib/api-client";
import { profileFeatureConfig } from "../config";
import {
  useFollowProfileMutation,
  useMyProfileQuery,
  useProfileQuery,
  useUnfollowProfileMutation,
  useUpdateMyProfileMutation,
  useUploadMyAvatarMutation
} from "../hooks";
import { createProfileUpdateInput, profileFormSchema, readAvatarFileError, type ProfileFormValues } from "../validation";

type ProfileWorkspaceProps = {
  profileId?: string;
};

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Avatar verisi okunamadi."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Avatar verisi okunamadi."));
    };

    reader.readAsDataURL(file);
  });
}

export function ProfileWorkspace({ profileId }: ProfileWorkspaceProps) {
  const { pushToast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const myProfileQuery = useMyProfileQuery(!profileId);
  const detailProfileQuery = useProfileQuery(profileId ?? "", Boolean(profileId));
  const profileQuery = profileId ? detailProfileQuery : myProfileQuery;
  const updateProfileMutation = useUpdateMyProfileMutation();
  const uploadAvatarMutation = useUploadMyAvatarMutation();
  const followProfileMutation = useFollowProfileMutation();
  const unfollowProfileMutation = useUnfollowProfileMutation();
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      skillsText: ""
    }
  });

  const profile = profileQuery.data;
  const bioLength = profileForm.watch("bio").length;
  const isFollowPending = followProfileMutation.isPending || unfollowProfileMutation.isPending;
  const hasEmptyProfile = Boolean(
    profile?.isOwner && profile.bio.trim().length === 0 && profile.skills.length === 0 && !profile.avatarUrl
  );

  useEffect(() => {
    if (!profile?.isOwner) {
      return;
    }

    profileForm.reset({
      bio: profile.bio,
      skillsText: profile.skills.join(", ")
    });
  }, [profile?.bio, profile?.id, profile?.isOwner, profile?.skills, profileForm]);

  function showToast(tone: "success" | "error" | "info", title: string, description: string) {
    pushToast({
      tone,
      title,
      description
    });
  }

  async function handleProfileSubmit(values: ProfileFormValues) {
    try {
      await updateProfileMutation.mutateAsync(createProfileUpdateInput(values));
      showToast("success", "Profil kaydedildi", profileFeatureConfig.messages.saveSuccess);
    } catch (error) {
      showToast("error", "Profil kaydedilemedi", readApiErrorMessage(error));
    }
  }

  async function handleAvatarUpload() {
    if (!avatarFile) {
      showToast("info", "Avatar secilmedi", profileFeatureConfig.messages.avatarHint);
      return;
    }

    const fileError = readAvatarFileError(avatarFile);

    if (fileError) {
      showToast("error", "Avatar gecersiz", fileError);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(avatarFile);

      await uploadAvatarMutation.mutateAsync({
        contentType: avatarFile.type,
        dataUrl
      });

      setAvatarFile(null);
      showToast("success", "Avatar guncellendi", profileFeatureConfig.messages.avatarSuccess);
    } catch (error) {
      showToast("error", "Avatar yuklenemedi", readApiErrorMessage(error));
    }
  }

  async function handleFollowToggle() {
    if (!profile || profile.isOwner) {
      return;
    }

    try {
      if (profile.isFollowing) {
        await unfollowProfileMutation.mutateAsync(profile.id);
      } else {
        await followProfileMutation.mutateAsync(profile.id);
      }

      showToast("success", "Takip durumu guncellendi", profileFeatureConfig.messages.followSuccess);
    } catch (error) {
      showToast("error", "Takip islemi tamamlanamadi", readApiErrorMessage(error));
    }
  }

  if (profileQuery.isLoading) {
    return (
      <div className="profile-grid">
        <Card accent className="profile-card">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
        </Card>
        <Card className="profile-card">
          <Skeleton className="skeleton-block" />
        </Card>
      </div>
    );
  }

  if (profileQuery.isError) {
    const error = profileQuery.error;

    if (error instanceof ApiClientError && error.status === 404) {
      return (
        <EmptyState
          actionLabel="Benim profile don"
          description={profileFeatureConfig.messages.notFound}
          onAction={() => {
            window.location.href = profileFeatureConfig.paths.myProfile;
          }}
          title="Profil bulunamadi"
        />
      );
    }

    return (
      <EmptyState
        actionLabel="Tekrar dene"
        description={profileFeatureConfig.messages.loadError}
        onAction={() => void profileQuery.refetch()}
        title="Profil su an okunamiyor"
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState description={profileFeatureConfig.messages.notFound} title="Profil bulunamadi" />
    );
  }

  return (
    <div className="profile-layout">
      <div className="profile-grid">
        <Card accent className="profile-card profile-hero-card">
          <div className="profile-header-block">
            <div className="avatar-stack">
              <div className="avatar-badge" aria-hidden="true">
                {profile.avatarUrl ? (
                  <img alt={`${profile.username} avatar`} className="avatar-image" src={profile.avatarUrl} />
                ) : (
                  <span>{readInitial(profile.username)}</span>
                )}
              </div>

              <div>
                <p className="eyebrow">{profile.isOwner ? "Benim profilim" : "Profil gorunumu"}</p>
                <h1>{profile.username}</h1>
                <p className="lead-copy">{profile.bio || profileFeatureConfig.messages.emptyBio}</p>
              </div>
            </div>

            <div className="profile-action-stack">
              {profile.isOwner ? (
                <Link className="ui-link" href={profileFeatureConfig.paths.detail(profile.id)}>
                  Genel gorunumu ac
                </Link>
              ) : (
                <>
                  <Button disabled={isFollowPending} onClick={() => void handleFollowToggle()} type="button">
                    {profile.isFollowing ? "Takipten cik" : "Takip et"}
                  </Button>
                  <Link className="ui-link" href={messagesFeatureConfig.paths.detail(profile.id)}>
                    Mesaj gonder
                  </Link>
                </>
              )}
            </div>
          </div>

          {hasEmptyProfile ? (
            <div className="notice-strip">
              <strong>Ilk profil adimi</strong>
              <span>{profileFeatureConfig.messages.firstProfileHint}</span>
            </div>
          ) : null}

          <div className="profile-stat-grid">
            <div className="profile-stat-box">
              <span>Takipci</span>
              <strong>{profile.stats.followers}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Takip edilen</span>
              <strong>{profile.stats.following}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Paylasim</span>
              <strong>{profile.stats.posts}</strong>
            </div>
          </div>

          <div className="chip-row">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="chip">{profileFeatureConfig.messages.emptySkills}</span>
            )}
          </div>
        </Card>

        <Card className="profile-card profile-form-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">{profile.isOwner ? "Profil duzenleme" : "Takip durumu"}</p>
              <h2>{profile.isOwner ? "Bilgileri guncelle" : "Sosyal bag"}</h2>
            </div>
            {!profile.isOwner ? <span className="chip">{profileFeatureConfig.messages.relationshipHint}</span> : null}
          </div>

          {profile.isOwner ? (
            <form className="profile-form" onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
              <label className="field-group">
                <span>Biyografi</span>
                <Textarea
                  hasError={Boolean(profileForm.formState.errors.bio)}
                  placeholder={profileFeatureConfig.form.bioPlaceholder}
                  rows={6}
                  {...profileForm.register("bio")}
                />
                <div className="field-meta-row">
                  <small className="muted">{bioLength}/{profileFeatureConfig.form.bioMaxLength}</small>
                  {profileForm.formState.errors.bio ? (
                    <small className="field-error">{profileForm.formState.errors.bio.message}</small>
                  ) : null}
                </div>
              </label>

              <label className="field-group">
                <span>Beceri etiketleri</span>
                <Input
                  hasError={Boolean(profileForm.formState.errors.skillsText)}
                  placeholder={profileFeatureConfig.form.skillsPlaceholder}
                  type="text"
                  {...profileForm.register("skillsText")}
                />
                <div className="field-meta-row">
                  <small className="muted">Virgul ile ayir. Ust limit {profileFeatureConfig.form.skillMaxCount} etiket.</small>
                  {profileForm.formState.errors.skillsText ? (
                    <small className="field-error">{profileForm.formState.errors.skillsText.message}</small>
                  ) : null}
                </div>
              </label>

              <div className="action-row">
                <Button disabled={updateProfileMutation.isPending} type="submit">
                  Profili kaydet
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-side-copy">
              <p className="muted">Bu ekranda baska bir kullanicinin herkese acik profilini goruyorsun.</p>
              <p className="muted">Takip durumu butonla yonetilir, duzenleme erisimi ise sadece profil sahibine aittir.</p>
              <Link className="ui-link" href={profileFeatureConfig.paths.myProfile}>
                Benim profile don
              </Link>
            </div>
          )}
        </Card>
      </div>

      <div className="profile-grid profile-grid-secondary">
        <Card className="profile-card profile-upload-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Avatar akisi</p>
              <h2>{profile.isOwner ? "Avatar guncelle" : "Avatar durumu"}</h2>
            </div>
          </div>

          {profile.isOwner ? (
            <div className="profile-upload-panel">
              <label className="field-group">
                <span>Yeni avatar dosyasi</span>
                <Input
                  accept={profileFeatureConfig.form.avatarAccept}
                  onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </label>

              <p className="muted">{profileFeatureConfig.messages.avatarHint}</p>

              <div className="action-row">
                <Button disabled={uploadAvatarMutation.isPending} onClick={() => void handleAvatarUpload()} type="button">
                  Avatar yukle
                </Button>
              </div>
            </div>
          ) : (
            <p className="muted">Bu kullanicinin avatar gorseli profilde herkes tarafindan gorulebilir.</p>
          )}
        </Card>

        <PostListPanel
          description={postsFeatureConfig.messages.profileEmptyDescription}
          profileId={profile.id}
          title={postsFeatureConfig.messages.profilePostsTitle}
        />
      </div>
    </div>
  );
}