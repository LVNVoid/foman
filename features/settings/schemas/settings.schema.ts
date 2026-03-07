import { z } from "zod";

export const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  whatsappNumber: z.string().optional().refine(
    (val) => !val || /^62\d+$/.test(val),
    "Nomor WhatsApp harus diawali dengan 62 dan hanya berisi angka"
  ),
  contactEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  contactAddress: z.string().optional(),
  googleMapsEmbedUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  openDays: z.string().optional(),
  openHours: z.string().optional(),
});

export type UpdateStoreSettingsInput = z.infer<typeof settingsSchema>;
