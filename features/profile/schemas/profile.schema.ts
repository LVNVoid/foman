import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  email: z.string().email("Alamat email tidak valid").optional(),
  phoneNumber: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: "Format nomor telepon tidak valid, contoh: 08123456789",
  }).optional(),
  password: z.union([
    z.string().min(6, "Kata sandi minimal 6 karakter"),
    z.literal(""),
    z.literal(null),
    z.undefined()
  ]).optional(),
  image: z.custom<File>((val) => val instanceof File).optional(),
  deleteImage: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
