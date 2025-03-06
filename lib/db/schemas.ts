import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/sample.constants";

import { z } from "zod";

export const addSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
});

export type AddSampleFormData = z.infer<typeof addSampleSchema>;

export const deleteSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
});

export type DeleteSampleFormData = z.infer<typeof deleteSampleSchema>;

export const editSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
});

export type EditSampleFormData = z.infer<typeof editSampleSchema>;
