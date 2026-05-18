"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@web/components/providers/toast-provider";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { CodePreview } from "@web/components/ui/code-preview";
import { Input } from "@web/components/ui/input";
import { MediaUploadShell } from "@web/components/ui/media-upload-shell";
import { Textarea } from "@web/components/ui/textarea";
import { readApiErrorMessage } from "@web/lib/api-client";
import { cn } from "@web/lib/cn";
import { postsFeatureConfig } from "../config";
import { useCreatePostMutation } from "../hooks";
import { buildCreatePostInput, postComposerSchema, readPostFileError, type PostComposerValues } from "../validation";

type PostComposerProps = {
  surface?: "card" | "dialog";
  onSuccess?: () => void;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Görsel verisi okunamadı."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Görsel verisi okunamadı."));
    };

    reader.readAsDataURL(file);
  });
}

export function PostComposer({ surface = "card", onSuccess }: PostComposerProps) {
  const { pushToast } = useToast();
  const createPostMutation = useCreatePostMutation();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<PostComposerValues>({
    resolver: zodResolver(postComposerSchema),
    defaultValues: {
      postType: "text",
      content: "",
      codeLanguage: ""
    }
  });

  const postType = form.watch("postType");
  const content = form.watch("content");
  const codeLanguage = form.watch("codeLanguage");

  useEffect(() => {
    if (!mediaFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(mediaFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [mediaFile]);

  function showToast(tone: "success" | "error" | "info", title: string, description: string) {
    pushToast({
      tone,
      title,
      description
    });
  }

  async function handleSubmit(values: PostComposerValues) {
    try {
      const mediaError = mediaFile ? readPostFileError(mediaFile) : null;

      if (mediaError) {
        showToast("error", "Görsel geçersiz", mediaError);
        return;
      }

      const media = mediaFile
        ? {
            contentType: mediaFile.type,
            dataUrl: await readFileAsDataUrl(mediaFile)
          }
        : null;

      await createPostMutation.mutateAsync(buildCreatePostInput(values, media));
      form.reset({
        postType: "text",
        content: "",
        codeLanguage: ""
      });
      setMediaFile(null);
      showToast("success", "Paylaşım hazır", postsFeatureConfig.messages.createSuccess);
      onSuccess?.();
    } catch (error) {
      showToast("error", "Paylaşım oluşturulamadı", readApiErrorMessage(error));
    }
  }

  const composerHeader = surface === "dialog" ? (
    <div className="post-launcher-intro">
      <h3>Yeni paylaşım</h3>
    </div>
  ) : (
    <div className="section-head">
      <h2>Yeni paylaşım</h2>
    </div>
  );

  const composerForm = (
    <form className="post-composer-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="post-type-row" role="tablist" aria-label="Post tipi secimi">
        {postsFeatureConfig.form.postTypes.map((type) => (
          <Button
            className={postType === type ? "active-pill" : undefined}
            key={type}
            onClick={() => form.setValue("postType", type, { shouldValidate: true })}
            type="button"
            variant="ghost"
          >
            {type}
          </Button>
        ))}
      </div>

      <label className="field-group">
          <span>{postType === "image" ? "Açıklama" : "İçerik"}</span>
        <Textarea
          hasError={Boolean(form.formState.errors.content)}
          placeholder={
            postType === "code"
              ? postsFeatureConfig.form.codePlaceholder
              : postType === "image"
                ? postsFeatureConfig.form.imagePlaceholder
                : postsFeatureConfig.form.contentPlaceholder
          }
          rows={surface === "dialog" ? 7 : 6}
          {...form.register("content")}
        />
        <div className="field-meta-row">
          <small className="muted">{content.length}/{postsFeatureConfig.limits.contentMaxLength}</small>
          {form.formState.errors.content ? <small className="field-error">{form.formState.errors.content.message}</small> : null}
        </div>
      </label>

      {postType === "code" ? (
        <label className="field-group">
          <span>Kod dili</span>
          <select className="ui-input" {...form.register("codeLanguage")}>
            <option value="">Dil sec</option>
            {postsFeatureConfig.form.codeLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {form.formState.errors.codeLanguage ? <small className="field-error">{form.formState.errors.codeLanguage.message}</small> : null}
        </label>
      ) : null}

      {postType === "image" ? (
        <div className="post-media-panel">
          <label className="field-group">
            <span>Görsel dosyası</span>
            <Input
              accept={postsFeatureConfig.form.mediaAccept}
              onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <small className="muted">{postsFeatureConfig.messages.mediaHint}</small>
          <small className="muted">{postsFeatureConfig.messages.imageCaptionHint}</small>
        </div>
      ) : null}

      <div className="action-row">
        <Button disabled={createPostMutation.isPending} type="submit">
          Paylaşımı oluştur
        </Button>
      </div>
    </form>
  );

  const previewContent = (
    <div className="post-preview-area">
      {postType === "code" ? (
        <CodePreview code={content || "// Kod önizlemesi burada görünecek"} language={codeLanguage || "kod"} title="Önizleme" />
      ) : postType === "image" ? (
        <Card className="post-preview-card">
          <p className="composer-preview-heading">Önizleme</p>
          {previewUrl ? <img alt="Seçilen görsel önizlemesi" className="post-media-preview" src={previewUrl} /> : <MediaUploadShell description={postsFeatureConfig.messages.mediaHint} title="Görsel seçimi bekleniyor" />}
          {content.trim().length > 0 ? <p className="muted">{content}</p> : null}
        </Card>
      ) : (
        <Card className="post-preview-card">
          <p className="composer-preview-heading">Önizleme</p>
          <p className="lead-copy">{content.trim().length > 0 ? content : "Metin önizlemesi burada görünecek."}</p>
        </Card>
      )}
    </div>
  );

  if (surface === "dialog") {
    return (
      <section className="post-launcher-panel">
        <div className="post-launcher-main">
          {composerForm}
        </div>
        <div className="post-launcher-preview-column">
          {previewContent}
        </div>
      </section>
    );
  }

  return (
    <Card className={cn("dashboard-card composer-card post-composer-card")}>
      {composerHeader}
      {composerForm}
      {previewContent}
    </Card>
  );
}