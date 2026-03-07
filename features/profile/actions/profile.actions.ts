"use server";

import { z } from "zod";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "../schemas/profile.schema";
import { updateProfileService } from "../services/profile.service";

interface FormState {
  success: boolean;
  error: string | null;
}

export async function updateProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("image") as File | null;
  const deleteImage = formData.get("deleteImage") === "true";

  const parsed = updateProfileSchema.safeParse({ ...data, image: file ?? undefined, deleteImage });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  try {
    await updateProfileService(parsed.data);
    
    revalidatePath("/profile");
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
