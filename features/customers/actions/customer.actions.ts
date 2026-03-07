"use server";

import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { customerSchema } from "../schemas/customer.schema";
import {
  getCustomersService,
  getCustomerService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from "../services/customer.service";

interface FormState {
  success: boolean;
  error: string | null;
}

export async function getCustomers(params: {
  query?: string;
  page?: number;
  limit?: number;
} = {}) {
  return await getCustomersService(params);
}

export async function getCustomer(id: string) {
  return await getCustomerService(id);
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("image") as File | null;

  const parsed = customerSchema.safeParse({ ...data, image: file ?? undefined });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  try {
    await createCustomerService(parsed.data);
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user" };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("image") as File | null;
  const id = formData.get("id") as string;

  const parsed = customerSchema.safeParse({ ...data, image: file ?? undefined, id });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  try {
    await updateCustomerService(parsed.data);
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" };
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteUser(userId: string) {
  try {
    await deleteCustomerService(userId);
    revalidatePath("/users");
    // Also revalidate admin customers if applicable
    revalidatePath("/admin/customers");
  } catch (error) {
    console.error(error);
  }
}
