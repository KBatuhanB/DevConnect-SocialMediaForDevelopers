"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@web/components/providers/toast-provider";
import { Button, getButtonClassName } from "@web/components/ui/button";
import { Dialog } from "@web/components/ui/dialog";
import { appShellConfig } from "../config";
import { designSystemConfig } from "@web/features/design-system/config";
import { useLogoutMutation } from "@web/features/auth/hooks";
import { authFeatureConfig } from "@web/features/auth/config";
import { cn } from "@web/lib/cn";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { pushToast } = useToast();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    const result = await logoutMutation.mutateAsync();

    pushToast({
      tone: result.ok ? "success" : "error",
      title: result.ok ? "Oturum kapatildi" : "Cikis tamamlanamadi",
      description: result.message
    });

    if (result.ok) {
      router.push(authFeatureConfig.paths.auth);
    }
  }

  return (
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
            UI notlari
          </button>
          <button className={getButtonClassName("ghost", true)} onClick={() => void handleLogout()} type="button">
            Cikis yap
          </button>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <div>
            <p className="eyebrow">Ortak uygulama shell yapisi</p>
            <h2>{appShellConfig.app.name}</h2>
          </div>

          <div className="shell-header-actions">
            <Button onClick={() => setNavOpen((current) => !current)} type="button" variant="secondary">
              Menu
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
  );
}