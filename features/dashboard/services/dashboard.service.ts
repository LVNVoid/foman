import prisma from "@/lib/prisma";

export async function getDashboardStatsService() {

  const [
    totalProducts,
    totalCategories,
    totalCustomers,
    outOfStockVariants,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.productVariant.findMany({
      where: {
        stock: {
          lte: 0,
        },
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalCustomers,
    outOfStockVariants,
  };
}
