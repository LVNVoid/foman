"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useAdminContext } from "@/components/layouts/admin/admin.context";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Produk",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Kategori",
        href: "/admin/categories",
        icon: Package,
    },
    // {
    //     title: "Pesanan",
    //     href: "/admin/orders",
    //     icon: ShoppingCart,
    // },
    // {
    //     title: "Data Pelanggan",
    //     href: "/admin/customers",
    //     icon: Users,
    // },
    {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar({ storeName }: { storeName?: string }) {
    const pathname = usePathname();
    const { sidebarOpen, setSidebarOpen } = useAdminContext();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-300 lg:hidden",
                    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6 shrink-0">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-primary">{storeName || 'Admin'}</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Tutup sidebar</span>
                    </Button>
                </div>

                <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)} // Close on mobile when clicked
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
                
                <div className="p-4 border-t border-sidebar-border mt-auto">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-red-500 hover:text-red-600 focus:outline-none"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}
