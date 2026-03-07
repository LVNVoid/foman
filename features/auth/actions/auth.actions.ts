"use server";

import { z } from "zod";
import { ActionResult } from "@/types";
import { registerSchema } from "../schemas/auth.schema";
import { registerUserService } from "../services/auth.service";
import { redirect } from "next/navigation";

export async function signUp(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string }> {
  // Parsing formData to conform to standard Zod input validation
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phoneNumber: formData.get("phoneNumber") as string,
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await registerUserService(parsed.data);
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi." };
  }

  redirect("/login");
}
