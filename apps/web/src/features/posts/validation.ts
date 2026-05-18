import { z } from "zod";
import { postsFeatureConfig } from "./config";
import type { CreatePostInput, PostType } from "./types";

export const postComposerSchema = z
  .object({
    postType: z.enum(postsFeatureConfig.form.postTypes),
    content: z.string().max(postsFeatureConfig.limits.contentMaxLength, "İçerik limiti aşıldı."),
    codeLanguage: z.string().default("")
  })
  .superRefine((values, context) => {
    const normalizedContent = values.content.trim();

    if ((values.postType === "text" || values.postType === "code") && normalizedContent.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bu post tipi için içerik boş olamaz.",
        path: ["content"]
      });
    }

    if (values.postType === "code" && values.codeLanguage.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kod postu için dil seçmelisin.",
        path: ["codeLanguage"]
      });
    }
  });

export type PostComposerValues = z.infer<typeof postComposerSchema>;

export function readPostFileError(file: File) {
  if (!postsFeatureConfig.form.mediaAccept.split(",").includes(file.type)) {
    return "Sadece PNG, JPG veya WEBP dosyaları kabul edilir.";
  }

  if (file.size > postsFeatureConfig.limits.mediaMaxBytes) {
    return "Görsel boyutu 2 MB limitini aşamaz.";
  }

  return null;
}

export function buildCreatePostInput(values: PostComposerValues, media: CreatePostInput["media"]): CreatePostInput {
  return {
    postType: values.postType,
    content: values.content,
    codeLanguage: values.postType === "code" ? values.codeLanguage : null,
    media
  };
}

export function readPostPreviewTitle(postType: PostType) {
  switch (postType) {
    case "text":
      return "Metin önizlemesi";
    case "code":
      return "Kod önizlemesi";
    case "image":
      return "Görsel önizlemesi";
  }
}