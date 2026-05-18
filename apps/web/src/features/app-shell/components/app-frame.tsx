"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@web/components/providers/toast-provider";
import { Button, getButtonClassName } from "@web/components/ui/button";
import { Dialog } from "@web/components/ui/dialog";
import { authFeatureConfig } from "@web/features/auth/config";
import { useLogoutMutation } from "@web/features/auth/hooks";
import { appShellConfig } from "../config";
import { designSystemConfig } from "@web/features/design-system/config";
import { messagesFeatureConfig } from "@web/features/messages/config";
import { PostComposer } from "@web/features/posts/components/post-composer";
import { profileFeatureConfig } from "@web/features/profiles/config";
import { useProfileSearchQuery } from "@web/features/profiles/hooks";
import { cn } from "@web/lib/cn";

type AppFrameProps = {
  children: React.ReactNode;
  layout?: "auto" | "topbar";
};

function FollowingFeedIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="M8 7a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm8-1a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M3.5 18.5a4.5 4.5 0 0 1 9 0M14 17a3.5 3.5 0 0 1 6.5 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function GlobalFeedIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12h16M12 4c2.4 2.3 3.6 5 3.6 8S14.4 17.7 12 20c-2.4-2.3-3.6-5-3.6-8S9.6 6.3 12 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4.5 4v-4H7.5A2.5 2.5 0 0 1 5 13.5v-7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path d="M10 5H7.5A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19H10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 8.5 18.5 12 14 15.5M18 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function AppFrame({ children, layout = "auto" }: AppFrameProps) {
  const pathname = usePathname();
  const { pushToast } = useToast();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPostComposerOpen, setPostComposerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const logoutMutation = useLogoutMutation();
  const isFeedRoute = pathname === authFeatureConfig.paths.dashboard || pathname === `${authFeatureConfig.paths.dashboard}/global`;
  const isProfileRoute = pathname === profileFeatureConfig.paths.myProfile || pathname.startsWith(`${profileFeatureConfig.paths.myProfile}/`);
  const isMessagesRoute = pathname === messagesFeatureConfig.paths.main;
  const usesTopBarLayout = layout === "topbar" || isFeedRoute || isProfileRoute || isMessagesRoute;
  const shouldShowPostLauncher = isFeedRoute || isProfileRoute;
  const isFollowingFeed = pathname === authFeatureConfig.paths.dashboard;
  const isGlobalFeed = pathname === `${authFeatureConfig.paths.dashboard}/global`;
  const trimmedSearchQuery = searchQuery.trim();
  const isSearchPending = trimmedSearchQuery.length > 0 && trimmedSearchQuery !== debouncedSearchQuery;
  const profileSearchQuery = useProfileSearchQuery(debouncedSearchQuery, usesTopBarLayout);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(trimmedSearchQuery);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [trimmedSearchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, [pathname]);

  async function handleLogout() {
    const result = await logoutMutation.mutateAsync();

    pushToast({
      tone: result.ok ? "success" : "error",
      title: result.ok ? "Oturum kapatıldı" : "Çıkış tamamlanamadı",
      description: result.message
    });

    if (result.ok) {
      window.location.replace(authFeatureConfig.paths.auth);
    }
  }

  const postLauncher = shouldShowPostLauncher ? (
    <>
      <button
        aria-label="Yeni paylaşım"
        className="post-launcher-fab"
        onClick={() => setPostComposerOpen(true)}
        title="Yeni paylaşım"
        type="button"
      >
        <span aria-hidden="true" className="post-launcher-fab-glyph">+</span>
      </button>

      <Dialog
        bodyClassName="post-launcher-dialog-body"
        className="post-launcher-dialog"
        cardClassName="post-launcher-dialog-card"
        description="Metin, kod veya görsel odaklı yeni bir paylaşım hazırla. Yayınladığında feed ve profilinde görünür."
        onClose={() => setPostComposerOpen(false)}
        open={isPostComposerOpen}
        title="Yeni paylaşım"
      >
        <PostComposer onSuccess={() => setPostComposerOpen(false)} surface="dialog" />
      </Dialog>
    </>
  ) : null;

  if (usesTopBarLayout) {
    const shouldShowSearchResults = trimmedSearchQuery.length > 0;

    return (
      <>
        <div className="feed-app-shell">
        <a className="skip-link" href="#main-content">
          {designSystemConfig.accessibility.skipLinkText}
        </a>

        <header className="feed-topbar">
          <div className="feed-topbar-inner">
            <nav aria-label="Feed akışı seçici" className="feed-switch-group">
              <Link
                aria-label="Takip ettiklerinin feed akışı"
                className={cn("feed-icon-button", isFollowingFeed && "feed-icon-button-active")}
                href={authFeatureConfig.paths.dashboard}
                title="Takip ettiklerinin feed akışı"
              >
                <FollowingFeedIcon />
              </Link>

              <Link
                aria-label="Ortak feed akışı"
                className={cn("feed-icon-button", isGlobalFeed && "feed-icon-button-active")}
                href={`${authFeatureConfig.paths.dashboard}/global`}
                title="Ortak feed akışı"
              >
                <GlobalFeedIcon />
              </Link>
            </nav>

            <div className="feed-search-shell">
              <label className="feed-search-field" htmlFor="feed-user-search">
                <SearchIcon />
                <input
                  aria-label="Kullanıcı ara"
                  autoComplete="off"
                  className="feed-search-input"
                  id="feed-user-search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Kullanıcı ara"
                  type="search"
                  value={searchQuery}
                />
              </label>

              {shouldShowSearchResults ? (
                <div className="feed-search-results">
                  {isSearchPending ? <p className="feed-search-meta">Yazmayi biraktiginda araniyor...</p> : null}

                  {!isSearchPending && profileSearchQuery.isFetching ? <p className="feed-search-meta">Araniyor...</p> : null}

                  {!isSearchPending && !profileSearchQuery.isFetching && (profileSearchQuery.data?.length ?? 0) === 0 ? (
                    <p className="feed-search-meta">Eşleşen kullanıcı bulunamadı.</p>
                  ) : null}

                  {!isSearchPending
                    ? profileSearchQuery.data?.map((profile) => (
                    <Link
                      className="feed-search-result"
                      href={profileFeatureConfig.paths.detail(profile.id)}
                      key={profile.id}
                      onClick={() => setSearchQuery("")}
                    >
                      <span aria-hidden="true" className="feed-search-avatar">
                        {profile.avatarUrl ? <img alt="" className="feed-avatar-image" src={profile.avatarUrl} /> : profile.username.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="feed-search-result-copy">
                        <strong>{profile.username}</strong>
                        <span>Profili görüntüle</span>
                      </span>
                    </Link>
                      ))
                    : null}
                </div>
              ) : null}
            </div>

            <div className="feed-utility-group">
              <Link
                aria-label="Mesajlar"
                className={cn("feed-icon-button", isMessagesRoute && "feed-icon-button-active")}
                href={messagesFeatureConfig.paths.main}
                title="Mesajlar"
              >
                <MessagesIcon />
              </Link>

              <Link
                aria-label="Profilim"
                className={cn("feed-icon-button", isProfileRoute && "feed-icon-button-active")}
                href={profileFeatureConfig.paths.myProfile}
                title="Profilim"
              >
                <ProfileIcon />
              </Link>

              <button
                aria-label="Çıkış yap"
                className="feed-icon-button"
                onClick={() => void handleLogout()}
                title="Çıkış yap"
                type="button"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </header>

          <main className="feed-page-content" id="main-content">
            {children}
          </main>
        </div>
        {postLauncher}
      </>
    );
  }

  return (
    <>
      <div className="app-frame">
      <a className="skip-link" href="#main-content">
        {designSystemConfig.accessibility.skipLinkText}
      </a>

      <aside className={cn("shell-aside", isNavOpen && "shell-aside-open")}>
        <div className="brand-block">
          <p className="eyebrow">Faz 6</p>
          <h1>{designSystemConfig.shell.title}</h1>
          <p>{designSystemConfig.shell.subtitle}</p>
        </div>

        <nav className="shell-nav" aria-label="Ana navigasyon">
          {designSystemConfig.shell.navigation.map((item) => (
            <Link
              className={cn("nav-link", pathname === item.href && "nav-link-active")}
              href={item.href}
              key={item.href}
              onClick={() => setNavOpen(false)}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </nav>

        <div className="shell-side-actions">
          <button className={getButtonClassName("secondary", true)} onClick={() => setDialogOpen(true)} type="button">
            UI notları
          </button>
          <button className={getButtonClassName("ghost", true)} onClick={() => void handleLogout()} type="button">
            Çıkış yap
          </button>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <div>
            <p className="eyebrow">Ortak uygulama shell yapısı</p>
            <h2>{appShellConfig.app.name}</h2>
          </div>

          <div className="shell-header-actions">
            <Button onClick={() => setNavOpen((current) => !current)} type="button" variant="secondary">
              Menü
            </Button>
            <Button onClick={() => setDialogOpen(true)} type="button" variant="primary">
              Yardim
            </Button>
          </div>
        </header>

        <main className="shell-content" id="main-content">
          {children}
        </main>
      </div>

        <Dialog
          description="Bu alan, ekipte ortak UI ve veri kalibini hizli hatirlatmak icin eklendi."
          onClose={() => setDialogOpen(false)}
          open={isDialogOpen}
          title="Shell yardim notlari"
        >
          <ul className="modal-note-list">
            {designSystemConfig.shell.quickNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Dialog>
      </div>
      {postLauncher}
    </>
  );
}