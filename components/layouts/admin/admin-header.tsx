"use client";

import { Menu, } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAdminContext } from "@/components/layouts/admin/admin.context";
import { ModeToggle } from "@/components/mode-toggle";

export function AdminHeader() {
    const { setSidebarOpen } = useAdminContext();

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
                {/* <NotificationBell /> */}
            </div>
        </header>
    );
}
