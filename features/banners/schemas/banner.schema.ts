import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().optional(),
  active: z.boolean().default(false),
  image: z.custom<File>((val) => val instanceof File, "Image file is required").refine(
    (file) => file.size > 0, "Image is required"
  ).refine(
    (file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"
  ),
});

export type CreateBannerInput = z.infer<typeof bannerSchema>;
