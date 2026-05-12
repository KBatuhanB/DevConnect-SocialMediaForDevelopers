import { z } from "zod";
import { postsFeatureConfig } from "./config";
import type { CreatePostInput, PostType } from "./types";

export const postComposerSchema = z
  .object({
    postType: z.enum(postsFeatureConfig.form.postTypes),
    content: z.string().max(postsFeatureConfig.limits.contentMaxLength, "Icerik limiti asildi."),
    codeLanguage: z.string().default("")
  })
  .superRefine((values, context) => {
    const normalizedContent = values.content.trim();

    if ((values.postType === "text" || values.postType === "code") && normalizedContent.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bu post tipi icin icerik bos olamaz.",
        path: ["content"]
      });
    }

    if (values.postType === "code" && values.codeLanguage.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kod postu icin dil secmelisin.",
        path: ["codeLanguage"]
      });
    }
  });

export type PostComposerValues = z.infer<typeof postComposerSchema>;

export function readPostFileError(file: File) {
  if (!postsFeatureConfig.form.mediaAccept.split(",").includes(file.type)) {
    return "Sadece PNG, JPG veya WEBP dosyalari kabul edilir.";
  }

  if (file.size > postsFeatureConfig.limits.mediaMaxBytes) {
    return "Gorsel boyutu 2 MB limitini asamaz.";
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
      return "Metin onizlemesi";
    case "code":
      return "Kod onizlemesi";
    case "image":
      return "Gorsel onizlemesi";
  }
}