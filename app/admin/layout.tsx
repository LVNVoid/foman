import { AdminProvider } from "@/components/layouts/admin/admin.context";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminHeader } from "@/components/layouts/admin/admin-header";

import { getStoreSettingsService as getStoreSettings } from '@/features/settings/services/settings.service';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await getStoreSettings();
    const storeName = result.success ? result.settings?.storeName : "Store";

    return (
        <AdminProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <AdminSidebar storeName={storeName} />

                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}
