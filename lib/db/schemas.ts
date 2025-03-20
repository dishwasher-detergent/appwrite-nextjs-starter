import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/product.constants";

import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  teamId: z.string().min(1),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;

export const deleteProductSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
});

export type DeleteProductFormData = z.infer<typeof deleteProductSchema>;

export const editProductSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditProductFormData = z.infer<typeof editProductSchema>;
