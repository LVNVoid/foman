"use server";

import { revalidatePath } from "next/cache";
import { createCategorySchema, updateCategorySchema } from "@/features/categories/schemas/category.schema";
import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "@/features/categories/services/category.service";

export async function getCategories() {
  return await getCategoriesService();
}

export async function createCategory(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image") as File | null;
  const imageToPass = imageFile && imageFile.size > 0 ? imageFile : undefined;
  
  const parsed = createCategorySchema.safeParse({ ...data, image: imageToPass });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await createCategoryService(parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: { name: [error.message || "Failed to create category"] } };
  }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image") as File | null;
  const imageToPass = imageFile && imageFile.size > 0 ? imageFile : undefined;
  const deleteImage = formData.get("deleteImage") === "true";
  
  const parsed = updateCategorySchema.safeParse({ id, ...data, image: imageToPass, deleteImage });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCategoryService(parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: { name: [error.message || "Failed to update category"] } };
  }
}

export async function deleteCategory(id: string) {
  try {
    await deleteCategoryService(id);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus kategori." };
  }
}
