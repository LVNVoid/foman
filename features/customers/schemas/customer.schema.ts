import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: "Format nomor telepon Indonesia tidak valid",
  }),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  image: z.custom<File>((val) => val instanceof File).optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
