"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { Input } from "@web/components/ui/input";
import { WavyBackground } from "@web/components/ui/wavy-background";
import { authFeatureConfig } from "../config";
import { useLoginMutation, useRegisterMutation } from "../hooks";
import type { AuthMode } from "../types";
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from "../validation";

const authWaveColors = ["#38bdf8", "#4f8dff", "#818cf8", "#c084fc", "#22d3ee"];

function getPostAuthPath(candidate: string | null, fallback: string) {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}

export function AuthHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isPending, startTransition] = useTransition();
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

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
  const postAuthPath = getPostAuthPath(unauthorizedFrom, authFeatureConfig.paths.dashboard);

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
      showToast("error", "Kayıt tamamlanamadı", result.message);
      return;
    }

    registerForm.reset({
      username: values.username,
      email: values.email,
      password: ""
    });

    if (result.requiresEmailVerification) {
      showToast("info", "Kayıt oluştu", authFeatureConfig.messages.emailVerification);
      return;
    }

    showToast("success", "Kayıt tamamlandı", result.message);

    startTransition(() => {
      router.push(postAuthPath);
    });
  }

  async function handleLoginSubmit(values: LoginFormValues) {
    const result = await loginMutation.mutateAsync(values);

    if (!result.ok) {
      showToast("error", "Giriş tamamlanamadı", result.message);
      return;
    }

    loginForm.reset({
      email: values.email,
      password: ""
    });

    showToast("success", "Giriş başarılı", result.message);

    startTransition(() => {
      router.push(postAuthPath);
    });
  }

  return (
    <WavyBackground
      backgroundFill="#020617"
      blur={10}
      className="auth-wavy-content"
      colors={authWaveColors}
      containerClassName="auth-wavy-shell"
      speed="fast"
      waveOpacity={0.42}
      waveWidth={68}
    >
      <main className="page-shell auth-shell auth-product-shell">
        <section aria-label="DevConnect logo alani" className="auth-logo-panel">
          <div className="auth-logo-frame">
            <Image
              alt="DevConnect logo"
              className="auth-logo-image"
              height={310}
              priority
              src="/brand/devconnect-logo.png"
              width={370}
            />
          </div>
        </section>

        <section className="auth-panel-column">
          <Card className="auth-card auth-surface auth-form-surface">
            <h1 className="auth-sr-only">DevConnect giriş ve kayıt ekranı</h1>

            <div className="auth-pill-row auth-mode-toggle" aria-label="Auth mod seçici">
              <Button
                className={mode === "login" ? "active-pill" : undefined}
                onClick={() => setMode("login")}
                type="button"
                variant="ghost"
              >
                Giriş yap
              </Button>
              <Button
                className={mode === "register" ? "active-pill" : undefined}
                onClick={() => setMode("register")}
                type="button"
                variant="ghost"
              >
                Kayıt ol
              </Button>
            </div>

            {mode === "register" ? (
              <form className="auth-form auth-form-stack" onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
                <label className="field-group">
                  <span>Kullanıcı adı</span>
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
                  <span>Şifre</span>
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
                  Kaydı tamamla
                </Button>
              </form>
            ) : (
              <form className="auth-form auth-form-stack" onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
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
                  <span>Şifre</span>
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
                  Giriş yap
                </Button>
              </form>
            )}
          </Card>
        </section>
      </main>
    </WavyBackground>
  );
}