import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.custom<File>((val) => val instanceof File).optional().refine(
    (file) => !file || file.size <= 2 * 1024 * 1024,
    "Image size must be less than 2MB"
  ),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1, "Category ID is required"),
  deleteImage: z.boolean().optional().default(false),
}).partial({
  name: true,
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
