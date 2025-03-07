import { z } from "zod";

export const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
});

export const fileSchema = z.instanceof(File);

export const imageInputSchema = z.union([imageSchema, fileSchema, z.null()]);

export type ImagePreview = z.infer<typeof imageSchema>;
export type ImageInputValue = z.infer<typeof imageInputSchema>;
