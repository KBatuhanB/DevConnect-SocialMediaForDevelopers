import { z } from "zod";

export const feedQuerySchema = z
  .object({
    cursorCreatedAt: z.string().datetime().optional(),
    cursorId: z.string().uuid().optional(),
    mode: z.enum(["following", "global"]).default("following")
  })
  .superRefine((query, context) => {
    if ((query.cursorCreatedAt && !query.cursorId) || (!query.cursorCreatedAt && query.cursorId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cursor bilgisi eksik gonderildi."
      });
    }
  });