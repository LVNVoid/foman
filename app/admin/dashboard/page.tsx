import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/features/dashboard/actions/dashboard.actions";
import { CreditCard, Folder, Package, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      title: "Total Produk",
      value: stats.totalProducts,
      description: "Keseluruhan produk",
      icon: Package,
    },
    {
      title: "Total Kategori",
      value: stats.totalCategories,
      description: "Kategori produk",
      icon: Folder,
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
      <div className="grid gap-4 md:grid-cols-3">
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
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Out of Stock Warning Component */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Peringatan Stok Habis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Varian produk yang perlu diisi ulang</p>
          </CardHeader>
          <CardContent className="pt-6">
            {stats.outOfStockVariants.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-green-600 font-medium">Semua stok varian tersedia!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.outOfStockVariants.map((variant: any) => (
                  <div
                    key={variant.id}
                    className="flex justify-between items-center p-3 border rounded-lg bg-destructive/5"
                  >
                    <div>
                      <p className="font-semibold text-sm">{variant.product.name}</p>
                      <p className="text-xs text-muted-foreground">Varian: {variant.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ext-xs font-bold text-destructive hover:text-destructive/80 shrink-0">
                      <Link href={`/admin/products`}>
                        Stok 0
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
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