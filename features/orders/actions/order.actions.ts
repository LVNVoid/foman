"use server";

import { z } from "zod";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { createOrderSchema } from "../schemas/order.schema";
import { createOrderService, getUserOrdersService } from "../services/order.service";

export async function createOrder(
  input: z.infer<typeof createOrderSchema>
): Promise<ActionResult<any>> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createOrderService(parsed.data);
    
    try {
      revalidatePath("/orders");
    } catch (e) {
      console.warn("Could not revalidate path:", e);
    }
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat pesanan" };
  }
}

export async function getUserOrders(userId: string, statuses?: string[]) {
  try {
    const orders = await getUserOrdersService(userId, statuses);
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}
