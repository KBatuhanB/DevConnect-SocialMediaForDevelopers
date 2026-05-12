import { z } from "zod";
import { profileFeatureConfig } from "./config";
import type { UpdateMyProfileInput } from "./types";

function parseSkillsText(value: string) {
  const seenSkills = new Set<string>();

  return value
    .split(profileFeatureConfig.form.skillSeparator)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
    .filter((skill) => {
      const normalizedSkill = skill.toLowerCase();

      if (seenSkills.has(normalizedSkill)) {
        return false;
      }

      seenSkills.add(normalizedSkill);
      return true;
    });
}

export const profileFormSchema = z.object({
  bio: z.string().max(profileFeatureConfig.form.bioMaxLength, "Biyografi limiti asildi."),
  skillsText: z.string().superRefine((value, context) => {
    const skills = parseSkillsText(value);

    if (skills.length > profileFeatureConfig.form.skillMaxCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Etiket limiti asildi."
      });
    }

    const tooLongSkill = skills.find((skill) => skill.length > profileFeatureConfig.form.skillMaxLength);

    if (tooLongSkill) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Etiketlerden biri cok uzun."
      });
    }
  })
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function createProfileUpdateInput(values: ProfileFormValues): UpdateMyProfileInput {
  return {
    bio: values.bio,
    skills: parseSkillsText(values.skillsText)
  };
}

export function readAvatarFileError(file: File) {
  if (!profileFeatureConfig.form.avatarAccept.split(",").includes(file.type)) {
    return "Sadece PNG, JPG veya WEBP dosyalari kabul edilir.";
  }

  if (file.size > profileFeatureConfig.form.avatarMaxBytes) {
    return "Avatar boyutu 2 MB limitini asamaz.";
  }

  return null;
}