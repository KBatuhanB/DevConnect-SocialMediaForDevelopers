"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { Input } from "@web/components/ui/input";
import { authFeatureConfig } from "../config";
import { useLoginMutation, useLogoutMutation, useRegisterMutation, useSessionQuery } from "../hooks";
import type { AuthMode } from "../types";
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from "../validation";

export function AuthHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [mode, setMode] = useState<AuthMode>("register");
  const [isPending, startTransition] = useTransition();
  const sessionQuery = useSessionQuery();
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const unauthorizedFrom = searchParams.get("from");

  function showToast(tone: "success" | "error" | "info", title: string, description: string) {
    pushToast({
      tone,
      title,
      description
    });
  }

  async function handleRegisterSubmit(values: RegisterFormValues) {
    const result = await registerMutation.mutateAsync(values);

    if (!result.ok) {
      showToast("error", "Kayit tamamlanamadi", result.message);
      return;
    }

    registerForm.reset({
      username: values.username,
      email: values.email,
      password: ""
    });

    if (result.requiresEmailVerification) {
      showToast("info", "Kayit olustu", authFeatureConfig.messages.emailVerification);
      return;
    }

    showToast("success", "Kayit tamamlandi", result.message);

    startTransition(() => {
      router.push(authFeatureConfig.paths.dashboard);
    });
  }

  async function handleLoginSubmit(values: LoginFormValues) {
    const result = await loginMutation.mutateAsync(values);

    if (!result.ok) {
      showToast("error", "Giris tamamlanamadi", result.message);
      return;
    }

    loginForm.reset({
      email: values.email,
      password: ""
    });

    showToast("success", "Giris basarili", result.message);

    startTransition(() => {
      router.push(authFeatureConfig.paths.dashboard);
    });
  }

  async function handleLogout() {
    const result = await logoutMutation.mutateAsync();

    showToast(result.ok ? "success" : "error", result.ok ? "Cikis yapildi" : "Cikis hatasi", result.message);
    await sessionQuery.refetch();
  }

  return (
    <main className="page-shell auth-shell auth-page-grid">
      <Card accent className="hero-card auth-hero editorial-card">
        <p className="eyebrow">Faz 6 on yuz temeli</p>
        <h1>DevConnect kimlik merkezi</h1>
        <p>
          Bu ekran artik sadece auth testi degil; ortak form kalibi, toast sistemi, route yonlendirme
          ve query tabanli session modelini birlikte gosteren ana giris kapisi.
        </p>

        {unauthorizedFrom ? (
          <div className="notice-strip">
            <strong>Yonlendirme notu</strong>
            <span>
              {authFeatureConfig.messages.unauthorizedHint} Hedef: <code>{unauthorizedFrom}</code>
            </span>
          </div>
        ) : null}

        <div className="auth-pill-row" aria-label="Auth mod secici">
          <Button
            className={mode === "register" ? "active-pill" : undefined}
            onClick={() => setMode("register")}
            type="button"
            variant="ghost"
          >
            Kayit ol
          </Button>
          <Button
            className={mode === "login" ? "active-pill" : undefined}
            onClick={() => setMode("login")}
            type="button"
            variant="ghost"
          >
            Giris yap
          </Button>
        </div>
      </Card>

      <section className="auth-grid shell-two-col">
        <Card className="auth-card">
          <strong>{mode === "register" ? "Yeni hesap" : "Var olan hesap"}</strong>

          {mode === "register" ? (
            <form className="auth-form" onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
              <label className="field-group">
                <span>Kullanici adi</span>
                <Input
                  autoComplete="username"
                  hasError={Boolean(registerForm.formState.errors.username)}
                  placeholder={authFeatureConfig.form.usernamePlaceholder}
                  type="text"
                  {...registerForm.register("username")}
                />
                {registerForm.formState.errors.username ? (
                  <small className="field-error">{registerForm.formState.errors.username.message}</small>
                ) : null}
              </label>

              <label className="field-group">
                <span>E-posta</span>
                <Input
                  autoComplete="email"
                  hasError={Boolean(registerForm.formState.errors.email)}
                  placeholder={authFeatureConfig.form.emailPlaceholder}
                  type="email"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email ? (
                  <small className="field-error">{registerForm.formState.errors.email.message}</small>
                ) : null}
              </label>

              <label className="field-group">
                <span>Sifre</span>
                <Input
                  autoComplete="new-password"
                  hasError={Boolean(registerForm.formState.errors.password)}
                  placeholder={authFeatureConfig.form.passwordPlaceholder}
                  type="password"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password ? (
                  <small className="field-error">{registerForm.formState.errors.password.message}</small>
                ) : null}
              </label>

              <Button disabled={registerMutation.isPending || isPending} fullWidth type="submit">
                Kaydi tamamla
              </Button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
              <label className="field-group">
                <span>E-posta</span>
                <Input
                  autoComplete="email"
                  hasError={Boolean(loginForm.formState.errors.email)}
                  placeholder={authFeatureConfig.form.emailPlaceholder}
                  type="email"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email ? (
                  <small className="field-error">{loginForm.formState.errors.email.message}</small>
                ) : null}
              </label>

              <label className="field-group">
                <span>Sifre</span>
                <Input
                  autoComplete="current-password"
                  hasError={Boolean(loginForm.formState.errors.password)}
                  placeholder={authFeatureConfig.form.passwordPlaceholder}
                  type="password"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password ? (
                  <small className="field-error">{loginForm.formState.errors.password.message}</small>
                ) : null}
              </label>

              <Button disabled={loginMutation.isPending || isPending} fullWidth type="submit">
                Giris yap
              </Button>
            </form>
          )}
        </Card>

        <Card className="auth-card status-card">
          <strong>Oturum durumu</strong>

          <p className="muted">
            {sessionQuery.isLoading
              ? "Oturum kontrolu yapiliyor."
              : sessionQuery.data
                ? authFeatureConfig.messages.activeSession
                : authFeatureConfig.messages.noSession}
          </p>

          <div className="session-box">
            <span>Aktif kullanici</span>
            <strong>{sessionQuery.data?.email ?? "Oturum yok"}</strong>
          </div>

          <div className="session-box">
            <span>Korunan sayfa</span>
            <strong>{authFeatureConfig.paths.dashboard}</strong>
          </div>

          <div className="action-row">
            <Button onClick={() => void sessionQuery.refetch()} type="button" variant="secondary">
              Oturumu yenile
            </Button>
            <Button onClick={handleLogout} type="button" variant="secondary">
              Cikis yap
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}