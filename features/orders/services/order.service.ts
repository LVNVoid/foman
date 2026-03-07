import prisma from "@/lib/prisma";
import { CreateOrderInput } from "../schemas/order.schema";
import { createNotificationService } from "@/features/notifications/services/notification.service";
import { Prisma } from "@/app/generated/prisma/client";

export async function createOrderService(data: CreateOrderInput) {
  const { userId, items } = data;

  const aggregatedItems = new Map<string, number>();
  for (const item of items) {
    const currentQuantity = aggregatedItems.get(item.productId) || 0;
    aggregatedItems.set(item.productId, currentQuantity + item.quantity);
  }

  let total = 0;
  const orderItemsData = [];

  for (const [productId, quantity] of aggregatedItems.entries()) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        price: true,
      },
    });

    if (!product) {
      throw new Error(`Produk dengan ID ${productId} tidak ditemukan`);
    }

    total += product.price * quantity;
    orderItemsData.push({
      productId: productId,
      quantity: quantity,
      price: product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "PENDING",
      items: {
        create: orderItemsData,
      },
    },
    select: {
      id: true,
      total: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          price: true,
        },
      },
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  for (const admin of admins) {
    await createNotificationService({
      userId: admin.id,
      title: "Pesanan Baru Masuk",
      message: `Pesanan baru #${order.id.slice(0, 8)} dari ${order.user.name}. Total: Rp ${total.toLocaleString("id-ID")}`,
      type: "ORDER",
      link: `/admin/orders/${order.id}`,
    });
  }

  return order;
}

export async function getUserOrdersService(userId: string, statuses?: string[]) {
  const whereClause: Prisma.OrderWhereInput = {
    userId,
  };

  if (statuses && statuses.length > 0) {
    whereClause.status = {
      in: statuses,
    };
  }

  return await prisma.order.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              pictures: {
                select: {
                  id: true,
                  imageUrl: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

export async function getOrdersService({
  query,
  status,
  page = 1,
  limit = 10,
}: {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  if (query) {
    where.OR = [
      { id: { contains: query, mode: "insensitive" } },
      { user: { name: { contains: query, mode: "insensitive" } } },
      { user: { email: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
}

export async function getOrderByIdService(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              pictures: {
                select: {
                  id: true,
                  imageUrl: true,
                  imagePublicId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

export async function updateOrderStatusService(id: string, status: string) {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      userId: true,
    },
  });

  // Notify Customer
  if (updatedOrder.userId) {
    let message = `Status pesanan #${updatedOrder.id.slice(0, 8)} berubah menjadi ${status}.`;
    let title = "Status Pesanan Update";

    switch (status) {
      case "PAID":
        title = "Pembayaran Diterima";
        message = `Pembayaran untuk pesanan #${updatedOrder.id.slice(0, 8)} telah kami terima. Pesanan sedang diproses.`;
        break;
      case "SHIPPED":
        title = "Pesanan Dikirim";
        message = `Pesanan #${updatedOrder.id.slice(0, 8)} telah dikirim.`;
        break;
      case "COMPLETED":
        title = "Pesanan Selesai";
        message = `Pesanan #${updatedOrder.id.slice(0, 8)} telah selesai. Terima kasih telah berbelanja di Foman Percetakan!`;
        break;
      case "CANCELLED":
        title = "Pesanan Dibatalkan";
        message = `Mohon maaf, pesanan #${updatedOrder.id.slice(0, 8)} telah dibatalkan.`;
        break;
      case "PENDING":
        title = "Menunggu Pembayaran";
        message = `Pesanan #${updatedOrder.id.slice(0, 8)} sedang menunggu pembayaran.`;
        break;
    }

    await createNotificationService({
      userId: updatedOrder.userId,
      title: title,
      message: message,
      type: "ORDER",
      link: `/orders`,
    });
  }

  return updatedOrder;
}
