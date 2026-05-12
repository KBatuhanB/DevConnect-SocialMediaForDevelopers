import { z } from "zod";
import { postsConfig } from "./config";

const mediaPayloadSchema = z.object({
  contentType: z.enum(postsConfig.storage.allowedMimeTypes),
  dataUrl: z.string().min(1, "Medya verisi bos olamaz.")
});

const textPostSchema = z.object({
  postType: z.literal("text"),
  content: z.string().max(postsConfig.limits.contentMaxLength, "Icerik limiti asildi."),
  codeLanguage: z.null(),
  media: z.null()
});

const codePostSchema = z.object({
  postType: z.literal("code"),
  content: z.string().max(postsConfig.limits.contentMaxLength, "Icerik limiti asildi."),
  codeLanguage: z.enum(postsConfig.content.supportedCodeLanguages),
  media: z.null()
});

const imagePostSchema = z.object({
  postType: z.literal("image"),
  content: z.string().max(postsConfig.limits.contentMaxLength, "Icerik limiti asildi."),
  codeLanguage: z.null(),
  media: mediaPayloadSchema
});

export const createPostSchema = z.discriminatedUnion("postType", [textPostSchema, codePostSchema, imagePostSchema]);

export const profilePostsParamsSchema = z.object({
  profileId: z.string().uuid("Gecersiz profil kimligi.")
});

export const postParamsSchema = z.object({
  postId: z.string().uuid("Gecersiz post kimligi.")
});