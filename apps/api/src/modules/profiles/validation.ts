import { z } from "zod";
import { profilesConfig } from "./config";

export const profileParamsSchema = z.object({
  profileId: z.string().uuid("Gecersiz profil kimligi.")
});

export const updateMyProfileSchema = z.object({
  bio: z.string().max(profilesConfig.limits.bioMaxLength, "Biyografi limiti asildi."),
  skills: z
    .array(z.string().trim().max(profilesConfig.limits.skillMaxLength, "Etiket cok uzun."))
    .max(profilesConfig.limits.skillMaxCount, "Etiket limiti asildi.")
});

export const uploadAvatarSchema = z.object({
  contentType: z.enum(profilesConfig.storage.allowedMimeTypes),
  dataUrl: z.string().min(1, "Avatar verisi bos olamaz.")
});

export const searchProfilesQuerySchema = z.object({
  query: z.string().trim().min(1, "Arama ifadesi bos olamaz.").max(profilesConfig.limits.searchQueryMaxLength)
});