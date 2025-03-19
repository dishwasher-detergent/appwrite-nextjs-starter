import {
  PROFILE_ABOUT_MAX_LENGTH,
  PROFILE_NAME_MAX_LENGTH,
} from "@/constants/profile.constants";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/sample.constants";

import { z } from "zod";

export const addSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  teamId: z.string().min(1),
});

export type AddSampleFormData = z.infer<typeof addSampleSchema>;

export const deleteSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
});

export type DeleteSampleFormData = z.infer<typeof deleteSampleSchema>;

export const editSampleSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditSampleFormData = z.infer<typeof editSampleSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(PROFILE_NAME_MAX_LENGTH, "Name must be less than 50 characters"),
  about: z
    .string()
    .max(PROFILE_ABOUT_MAX_LENGTH, "About must be less than 256 characters"),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
