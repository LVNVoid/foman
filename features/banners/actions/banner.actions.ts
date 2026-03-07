"use server";

import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { bannerSchema } from "../schemas/banner.schema";
import {
  getBannersService,
  getActiveBannersService,
  createBannerService,
  deleteBannerService,
  toggleBannerActiveService,
} from "../services/banner.service";

export async function getBanners() {
  return await getBannersService();
}

export async function getActiveBanners() {
  return await getActiveBannersService();
}

export async function createBanner(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("image") as File;
  
  const activeValue = formData.get("active") === "on";

  const parsed = bannerSchema.safeParse({ ...data, image: file, active: activeValue });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const banner = await createBannerService(parsed.data);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "Banner created successfully", banner };
  } catch (error: any) {
    return { error: { form: [error.message || "Failed to create banner"] } };
  }
}

export async function deleteBanner(id: string) {
  try {
    await deleteBannerService(id);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "Banner deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete banner" };
  }
}

export async function toggleBannerActive(id: string, active: boolean) {
  try {
    const banner = await toggleBannerActiveService(id, active);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "Banner status updated", banner };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update banner status" };
  }
}
