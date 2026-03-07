"use client";

import { Menu, User } from "lucide-react";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminContext } from "@/components/layouts/admin/admin.context";
import { ModeToggle } from "@/components/mode-toggle";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function AdminHeader() {
    const { setSidebarOpen } = useAdminContext();
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka sidebar</span>
            </Button>

            <div className="flex flex-1 items-center justify-end gap-4">
                <ModeToggle />
                <NotificationBell />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full overflow-hidden">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    fill
                                    sizes="(min-width: 768px) 48px, 32px"
                                    className="object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                            <span className="sr-only">Menu pengguna</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                        <DropdownMenuItem>Bantuan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
