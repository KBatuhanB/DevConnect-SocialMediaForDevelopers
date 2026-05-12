import { z } from "zod";
import { messagesConfig } from "./config";

export const messagePartnerParamsSchema = z.object({
  partnerId: z.string().uuid("Gecersiz profil kimligi.")
});

export const messageHistoryQuerySchema = z
  .object({
    cursorCreatedAt: z.string().datetime().optional(),
    cursorId: z.string().uuid().optional()
  })
  .superRefine((query, context) => {
    if ((query.cursorCreatedAt && !query.cursorId) || (!query.cursorCreatedAt && query.cursorId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cursor bilgisi eksik gonderildi."
      });
    }
  });

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid("Gecersiz alici kimligi."),
  content: z.string().max(messagesConfig.limits.messageMaxLength, "Mesaj limiti asildi.")
});