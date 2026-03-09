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
  
  let variants = [];
  let specifications = [];
  
  try {
    if (data.variantsData) {
      variants = JSON.parse(data.variantsData as string);
    }
    if (data.specificationsData) {
      specifications = JSON.parse(data.specificationsData as string);
    }
  } catch (e) {
    console.error("Failed to parse variants or specifications JSON", e);
    return { error: { form: ["Data varian atau spesifikasi tidak valid"] } };
  }
  
  const parsed = createProductSchema.safeParse({ 
    ...data, 
    images: files,
    variants,
    specifications
  });
  
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
  
  // Parse dynamic array fields from JSON strings
  let variants = [];
  let specifications = [];
  
  try {
    if (data.variantsData) {
      variants = JSON.parse(data.variantsData as string);
    }
    if (data.specificationsData) {
      specifications = JSON.parse(data.specificationsData as string);
    }
  } catch (e) {
    console.error("Failed to parse variants or specifications JSON", e);
    return { error: { form: ["Data varian atau spesifikasi tidak valid"] } };
  }
  
  const parsed = updateProductSchema.safeParse({ 
    id, 
    ...data, 
    images: files, 
    deletedImageIds,
    variants,
    specifications
  });
  
  if (!parsed.success) {
    console.error("Validation failed for updateProduct:", parsed.error.flatten().fieldErrors);
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateProductService(parsed.data);
  } catch (error: any) {
    console.error("Update product service error:", error);
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
