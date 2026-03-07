import prisma from "@/lib/prisma";

export async function getDashboardStatsService() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    // Total Revenue Bulan Ini
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ["PAID", "SHIPPED", "COMPLETED"],
        },
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    }),

    // Total Orders
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    }),

    // Total Products
    prisma.product.count(),

    // Total Customers
    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    // Recent Orders
    prisma.order.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            profileUrl: true,
          },
        },
      },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  };
}
