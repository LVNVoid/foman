import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/features/dashboard/actions/dashboard.actions";
import { CreditCard, DollarSign, Package, ShoppingCart, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Foman Percetakan",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardAdminPage() {
  const stats = await getDashboardStats();

  const getStatusColor = (status: string) => {
    const colors = {
      PAID: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const statCards = [
    {
      title: "Total Pendapatan Bulan Ini",
      value: formatCurrency(stats.totalRevenue),
      description: "Total pendapatan",
      icon: DollarSign,
    },
    {
      title: "Total Pesanan Bulan Ini",
      value: stats.totalOrders,
      description: "Pesanan masuk",
      icon: ShoppingCart,
    },
    {
      title: "Total Produk",
      value: stats.totalProducts,
      description: "Produk aktif",
      icon: Package,
    },
    {
      title: "Total Pelanggan",
      value: stats.totalCustomers,
      description: "Pelanggan terdaftar",
      icon: Users,
    },
  ];

  const quickActions = [
    {
      href: "/admin/products/new",
      icon: Package,
      label: "Tambah Produk Baru",
      description: "Tambah produk baru"
    },
    {
      href: "/admin/categories",
      icon: CreditCard,
      label: "Kategori",
      description: "Kelola kategori produk"
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Pesanan",
      description: "Kelola pesanan"
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang di dashboard admin</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between overflow-hidden">
                <div className="flex-1">
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3 ">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pesanan Terbaru</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Pesanan terbaru dari pelanggan</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">
                  Lihat Semua →
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Tidak ada pesanan ditemukan.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {order.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.user.email}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                      <span className={`inline-flex items-center mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Takes 1 column */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Aksi Cepat</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Kelola dengan cepat</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                asChild
                className="w-full justify-start h-auto py-4"
                variant="outline"
              >
                <Link href={action.href}>
                  <div className="flex items-center w-full">
                    <div className="bg-muted p-2 rounded-lg mr-3">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}