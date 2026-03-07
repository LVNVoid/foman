"use server";

import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { settingsSchema } from "../schemas/settings.schema";
import {
  getStoreSettingsService,
  updateStoreSettingsService,
} from "../services/settings.service";

export async function getStoreSettings() {
  try {
    return await getStoreSettingsService();
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch settings" };
  }
}

export async function updateStoreSettings(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const parsed = settingsSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateStoreSettingsService(parsed.data);
    revalidatePath("/admin/settings");
    revalidatePath("/contact");
    revalidatePath("/about");
    return { success: true, message: "Settings updated successfully" };
  } catch (error: any) {
    return { error: { form: [error.message || "Failed to update settings"] } };
  }
}
