"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { Dialog } from "@web/components/ui/dialog";
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
import type { ProfileView } from "../types";
import { createProfileUpdateInput, profileFormSchema, readAvatarFileError, type ProfileFormValues } from "../validation";

type ProfileWorkspaceProps = {
  profileId?: string;
};

type ProfileSettingsEditor = "avatar" | "bio" | "skills" | null;

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M12 8.75a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5Zm7.1 3.25c0-.42-.04-.83-.12-1.22l2-1.56l-1.9-3.28l-2.42.97a7.9 7.9 0 0 0-2.11-1.22L14.2 3h-4.4l-.35 2.69a7.9 7.9 0 0 0-2.11 1.22l-2.42-.97l-1.9 3.28l2 1.56A6.9 6.9 0 0 0 4.9 12c0 .42.04.83.12 1.22l-2 1.56l1.9 3.28l2.42-.97c.65.53 1.37.94 2.11 1.22L9.8 21h4.4l.35-2.69a7.9 7.9 0 0 0 2.11-1.22l2.42.97l1.9-3.28l-2-1.56c.08-.39.12-.8.12-1.22Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function buildSettingsFormDefaults(profile: ProfileView): ProfileFormValues {
  return {
    bio: profile.bio,
    skillsText: profile.skills.join(", ")
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Avatar verisi okunamadı."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Avatar verisi okunamadı."));
    };

    reader.readAsDataURL(file);
  });
}

export function ProfileWorkspace({ profileId }: ProfileWorkspaceProps) {
  const { pushToast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [settingsEditor, setSettingsEditor] = useState<ProfileSettingsEditor>(null);
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

    profileForm.reset(buildSettingsFormDefaults(profile));
  }, [profile?.bio, profile?.id, profile?.isOwner, profile?.skills, profileForm]);

  function showToast(tone: "success" | "error" | "info", title: string, description: string) {
    pushToast({
      tone,
      title,
      description
    });
  }

  function resetOwnerDrafts(nextProfile: ProfileView) {
    profileForm.reset(buildSettingsFormDefaults(nextProfile));
    setAvatarFile(null);
  }

  function handleOpenSettingsMenu() {
    if (!profile?.isOwner) {
      return;
    }

    resetOwnerDrafts(profile);
    setSettingsEditor(null);
    setSettingsMenuOpen(true);
  }

  function handleOpenSettingsEditor(nextStep: Exclude<ProfileSettingsEditor, null>) {
    if (!profile?.isOwner) {
      return;
    }

    resetOwnerDrafts(profile);
    setSettingsMenuOpen(false);
    setSettingsEditor(nextStep);
  }

  function handleCloseSettingsDialogs() {
    if (profile?.isOwner) {
      resetOwnerDrafts(profile);
    }

    setSettingsMenuOpen(false);
    setSettingsEditor(null);
  }

  function handleCloseSettingsMenu() {
    setSettingsMenuOpen(false);
  }

  async function handleProfileSubmit(values: ProfileFormValues) {
    try {
      await updateProfileMutation.mutateAsync(createProfileUpdateInput(values));
      showToast("success", "Profil kaydedildi", profileFeatureConfig.messages.saveSuccess);
      handleCloseSettingsDialogs();
    } catch (error) {
      showToast("error", "Profil kaydedilemedi", readApiErrorMessage(error));
    }
  }

  async function handleAvatarUpload() {
    if (!avatarFile) {
      showToast("info", "Avatar seçilmedi", profileFeatureConfig.messages.avatarHint);
      return false;
    }

    const fileError = readAvatarFileError(avatarFile);

    if (fileError) {
      showToast("error", "Avatar geçersiz", fileError);
      return false;
    }

    try {
      const dataUrl = await readFileAsDataUrl(avatarFile);

      await uploadAvatarMutation.mutateAsync({
        contentType: avatarFile.type,
        dataUrl
      });

      setAvatarFile(null);
      showToast("success", "Avatar güncellendi", profileFeatureConfig.messages.avatarSuccess);
      handleCloseSettingsDialogs();
      return true;
    } catch (error) {
      showToast("error", "Avatar yüklenemedi", readApiErrorMessage(error));
      return false;
    }
  }

  async function handleBioSave() {
    if (!profile?.isOwner) {
      return;
    }

    const isValid = await profileForm.trigger("bio");

    if (!isValid) {
      return;
    }

    await handleProfileSubmit({
      bio: profileForm.getValues("bio"),
      skillsText: profile.skills.join(", ")
    });
  }

  async function handleSkillsSave() {
    if (!profile?.isOwner) {
      return;
    }

    const isValid = await profileForm.trigger("skillsText");

    if (!isValid) {
      return;
    }

    await handleProfileSubmit({
      bio: profile.bio,
      skillsText: profileForm.getValues("skillsText")
    });
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

      showToast("success", "Takip durumu güncellendi", profileFeatureConfig.messages.followSuccess);
    } catch (error) {
      showToast("error", "Takip işlemi tamamlanamadı", readApiErrorMessage(error));
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
          actionLabel="Benim profile dön"
          description={profileFeatureConfig.messages.notFound}
          onAction={() => {
            window.location.href = profileFeatureConfig.paths.myProfile;
          }}
          title="Profil bulunamadı"
        />
      );
    }

    return (
      <EmptyState
        actionLabel="Tekrar dene"
        description={profileFeatureConfig.messages.loadError}
        onAction={() => void profileQuery.refetch()}
        title="Profil şu an okunmuyor"
      />
    );
  }

  if (!profile) {
    return <EmptyState description={profileFeatureConfig.messages.notFound} title="Profil bulunamadı" />;
  }

  const profilePostsTitle = profile.isOwner ? "Paylaşımların" : `${profile.username} gönderileri`;

  return (
    <>
      <div className="profile-page-shell">
        <Card accent className="profile-card profile-summary-card">
          <div className="profile-summary-row">
            <div className="profile-avatar-column">
              <div className="profile-avatar-frame" aria-hidden="true">
                {profile.avatarUrl ? (
                  <img alt={`${profile.username} avatar`} className="avatar-image" src={profile.avatarUrl} />
                ) : (
                  <span>{readInitial(profile.username)}</span>
                )}
              </div>

              <p className="profile-avatar-note">
                {profile.isOwner ? "Profil fotoğrafını ayarlardan güncelleyebilirsin." : "Profil fotoğrafı herkese açık görünür."}
              </p>
            </div>

            <div className="profile-summary-body">
              <div className="profile-summary-head">
                <div className="profile-summary-title-block">
                  <h1>{profile.username}</h1>
                </div>

                {profile.isOwner ? (
                  <button
                    aria-label="Profil ayarlari"
                    className="profile-settings-button"
                    onClick={handleOpenSettingsMenu}
                    type="button"
                  >
                    <SettingsIcon />
                  </button>
                ) : (
                  <div className="profile-visitor-actions">
                    <Button disabled={isFollowPending} onClick={() => void handleFollowToggle()} type="button">
                      {profile.isFollowing ? "Takipten çık" : "Takip et"}
                    </Button>
                    <Link className="ui-link profile-message-link" href={messagesFeatureConfig.paths.detail(profile.id)}>
                      Mesaj gönder
                    </Link>
                  </div>
                )}
              </div>

              <div className="profile-summary-stats" role="list" aria-label="Profil istatistikleri">
                <div className="profile-stat-pill" role="listitem">
                  <strong>{profile.stats.posts}</strong>
                  <span>Paylaşım</span>
                </div>
                <div className="profile-stat-pill" role="listitem">
                  <strong>{profile.stats.followers}</strong>
                  <span>Takipçi</span>
                </div>
                <div className="profile-stat-pill" role="listitem">
                  <strong>{profile.stats.following}</strong>
                  <span>Takip edilen</span>
                </div>
              </div>

              <section className="profile-copy-section" aria-labelledby="profile-about-heading">
                <div className="profile-section-heading">
                  <p className="eyebrow" id="profile-about-heading">Hakkımda</p>
                </div>
                <p className="profile-about-copy">{profile.bio || profileFeatureConfig.messages.emptyBio}</p>

                {hasEmptyProfile ? (
                  <div className="notice-strip">
                    <strong>İlk profil adımı</strong>
                    <span>{profileFeatureConfig.messages.firstProfileHint}</span>
                  </div>
                ) : null}
              </section>

              <section className="profile-copy-section" aria-labelledby="profile-skills-heading">
                <div className="profile-section-heading">
                  <p className="eyebrow" id="profile-skills-heading">Beceriler</p>
                </div>

                <div className="chip-row profile-skill-row">
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
              </section>
            </div>
          </div>
        </Card>

        <PostListPanel
          description={profile.isOwner ? postsFeatureConfig.messages.emptyDescription : postsFeatureConfig.messages.profileEmptyDescription}
          profileId={profile.id}
          title={profilePostsTitle}
        />
      </div>

      {profile.isOwner ? (
        <>
          <Dialog
            description="Profilinde hangi bölümü güncellemek istediğini seç. Seçimin yeni bir düzenleme penceresi açacak."
            onClose={handleCloseSettingsMenu}
            open={isSettingsMenuOpen}
            title="Profil ayarları"
          >
            <div className="profile-settings-list">
              <button className="profile-settings-option" onClick={() => handleOpenSettingsEditor("avatar")} type="button">
                <strong>Profil fotoğrafını değiştir</strong>
                <span>Yeni avatar seç, yükle ve profile hemen yansıt.</span>
              </button>

              <button className="profile-settings-option" onClick={() => handleOpenSettingsEditor("bio")} type="button">
                <strong>Hakkımda bilgisini düzenle</strong>
                <span>Kısa teknik özetini veya biyografini güncelle.</span>
              </button>

              <button className="profile-settings-option" onClick={() => handleOpenSettingsEditor("skills")} type="button">
                <strong>Beceri etiketlerini düzenle</strong>
                <span>Profilinde görünen etiketleri virgülle güncelle.</span>
              </button>
            </div>
          </Dialog>

          <Dialog
            description="Profil fotoğrafını değiştirip kaydet veya iptal ile çık."
            onClose={handleCloseSettingsDialogs}
            open={settingsEditor === "avatar"}
            title="Profil fotoğrafını değiştir"
          >
            <div className="profile-settings-form">
              <div className="profile-avatar-editor">
                <div className="profile-avatar-frame profile-avatar-frame-compact" aria-hidden="true">
                  {profile.avatarUrl ? (
                    <img alt="Mevcut avatar" className="avatar-image" src={profile.avatarUrl} />
                  ) : (
                    <span>{readInitial(profile.username)}</span>
                  )}
                </div>

                <label className="field-group">
                  <span>Yeni profil fotoğrafı</span>
                  <Input
                    accept={profileFeatureConfig.form.avatarAccept}
                    onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                    type="file"
                  />
                </label>

                <p className="muted">{profileFeatureConfig.messages.avatarHint}</p>
              </div>

              <div className="profile-settings-actions">
                <Button onClick={handleCloseSettingsDialogs} type="button" variant="secondary">
                  İptal
                </Button>
                <Button disabled={uploadAvatarMutation.isPending} onClick={() => void handleAvatarUpload()} type="button">
                  Kaydet
                </Button>
              </div>
            </div>
          </Dialog>

          <Dialog
            description="Profilinde görünecek hakkımda metnini güncelle."
            onClose={handleCloseSettingsDialogs}
            open={settingsEditor === "bio"}
            title="Hakkımda bilgisini düzenle"
          >
            <form
              className="profile-settings-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleBioSave();
              }}
            >
              <label className="field-group">
                <span>Hakkımda</span>
                <Textarea
                  aria-label="Hakkımda"
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

              <div className="profile-settings-actions">
                <Button onClick={handleCloseSettingsDialogs} type="button" variant="secondary">
                  İptal
                </Button>
                <Button disabled={updateProfileMutation.isPending} type="submit">
                  Kaydet
                </Button>
              </div>
            </form>
          </Dialog>

          <Dialog
            description="Profilinde listelenecek becerileri virgülle ayırarak güncelle."
            onClose={handleCloseSettingsDialogs}
            open={settingsEditor === "skills"}
            title="Beceri etiketlerini düzenle"
          >
            <form
              className="profile-settings-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSkillsSave();
              }}
            >
              <label className="field-group">
                <span>Beceri etiketleri</span>
                <Input
                  aria-label="Beceri etiketleri"
                  hasError={Boolean(profileForm.formState.errors.skillsText)}
                  placeholder={profileFeatureConfig.form.skillsPlaceholder}
                  type="text"
                  {...profileForm.register("skillsText")}
                />
                <div className="field-meta-row">
                  <small className="muted">Virgülle ayır. Üst limit {profileFeatureConfig.form.skillMaxCount} etiket.</small>
                  {profileForm.formState.errors.skillsText ? (
                    <small className="field-error">{profileForm.formState.errors.skillsText.message}</small>
                  ) : null}
                </div>
              </label>

              <div className="profile-settings-actions">
                <Button onClick={handleCloseSettingsDialogs} type="button" variant="secondary">
                  İptal
                </Button>
                <Button disabled={updateProfileMutation.isPending} type="submit">
                  Kaydet
                </Button>
              </div>
            </form>
          </Dialog>
        </>
      ) : null}
    </>
  );
}