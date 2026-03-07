'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/actions/notifications';

interface GetOrdersParams {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getOrders({
  query,
  status,
  page = 1,
  limit = 10,
}: GetOrdersParams = {}) {
  try {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { user: { name: { contains: query, mode: 'insensitive' } } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'ALL') {
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
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      success: true,
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                pictures: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // Notify Customer
    if (updatedOrder.userId) {
      let message = `Status pesanan #${updatedOrder.id.slice(0, 8)} berubah menjadi ${status}.`;
      let title = 'Status Pesanan Update';

      switch (status) {
        case 'PAID':
          title = 'Pembayaran Diterima';
          message = `Pembayaran untuk pesanan #${updatedOrder.id.slice(0, 8)} telah kami terima. Pesanan sedang diproses.`;
          break;
        case 'SHIPPED':
          title = 'Pesanan Dikirim';
          message = `Pesanan #${updatedOrder.id.slice(0, 8)} telah dikirim.`;
          break;
        case 'COMPLETED':
          title = 'Pesanan Selesai';
          message = `Pesanan #${updatedOrder.id.slice(0, 8)} telah selesai. Terima kasih telah berbelanja di Foman Percetakan!`;
          break;
        case 'CANCELLED':
          title = 'Pesanan Dibatalkan';
          message = `Mohon maaf, pesanan #${updatedOrder.id.slice(0, 8)} telah dibatalkan.`;
          break;
        case 'PENDING':
          title = 'Menunggu Pembayaran';
          message = `Pesanan #${updatedOrder.id.slice(0, 8)} sedang menunggu pembayaran.`;
          break;
      }

      await createNotification({
        userId: updatedOrder.userId,
        title: title,
        message: message,
        type: 'ORDER',
        link: `/orders`,
      });
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
