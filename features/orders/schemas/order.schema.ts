import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "ID Produk tidak boleh kosong"),
  productVariantId: z.string().optional(),
  quantity: z.number().int().positive("Kuantitas minimal 1"),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

export const createOrderSchema = z.object({
  userId: z.string().min(1, "ID User tidak boleh kosong"),
  items: z.array(orderItemSchema).min(1, "Pesanan harus berisi minimal 1 produk"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  id: z.string().min(1, "ID Pesanan tidak boleh kosong"),
  status: z.enum(["PENDING", "PAID", "PACKING", "SHIPPED", "COMPLETED", "CANCELLED"], {
    message: "Status pesanan tidak valid",
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
