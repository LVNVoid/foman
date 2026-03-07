"use client";

import { createContext, useContext, useState } from "react";

interface AdminContextType {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AdminContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdminContext must be used within an AdminProvider");
    }
    return context;
}
