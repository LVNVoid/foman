import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater").default(0),
  unit: z.string().optional(),
});

export const productSpecificationSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.custom<File>((val) => val instanceof File, "File expected")
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  minPrice: z.coerce.number().min(0, "Harga minimum wajib diisi"),
  maxPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional(),
  images: z.array(z.custom<File>((val) => val instanceof File).optional()).optional(),
  variants: z.array(productVariantSchema).optional(),
  specifications: z.array(productSpecificationSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.extend({
  id: z.string().min(1, "Product ID is required"),
  deletedImageIds: z.array(z.string()).optional(),
}).partial({
  name: true,
  minPrice: true,
}).refine(data => data.id !== undefined, {
  message: "Product ID is required for updates",
  path: ["id"]
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
