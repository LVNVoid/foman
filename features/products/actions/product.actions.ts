"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";
import {
  getProductsService,
  getProductService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service";

export async function getProducts(params: {
  query?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  return await getProductsService(params);
}

export async function getProduct(id: string) {
  return await getProductService(id);
}

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const files = formData.getAll("images") as File[];
  
  const parsed = createProductSchema.safeParse({ ...data, images: files });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await createProductService(parsed.data);
  } catch (error: any) {
    return { error: { form: [error.message || "Failed to create product"] } };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const files = formData.getAll("images") as File[];
  const deletedImageIds = formData.getAll("deletedImageIds") as string[];
  
  const parsed = updateProductSchema.safeParse({ id, ...data, images: files, deletedImageIds });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateProductService(parsed.data);
  } catch (error: any) {
    return { error: { form: [error.message || "Failed to update product"] } };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await deleteProductService(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
