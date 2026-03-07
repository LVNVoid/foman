"use server";

import { z } from "zod";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { updateOrderStatusSchema } from "../schemas/order.schema";
import { 
  getOrdersService, 
  getOrderByIdService, 
  updateOrderStatusService 
} from "../services/order.service";

export async function getOrders(params: {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const result = await getOrdersService(params);
    return {
      success: true,
      orders: result.orders,
      pagination: result.pagination,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch orders" };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await getOrderByIdService(id);
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch order" };
  }
}

export async function updateOrderStatus(
  input: z.infer<typeof updateOrderStatusSchema>
): Promise<ActionResult<void>> {
  const parsed = updateOrderStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateOrderStatusService(parsed.data.id, parsed.data.status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${parsed.data.id}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order status" };
  }
}
