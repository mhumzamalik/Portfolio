"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    email?: string;
    fullName?: string;
  };
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300 font-sans">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          setIsMobileOpen={setIsMobileSidebarOpen}
          user={user}
        />

        <main
          className={`flex-1 p-6 md:p-8 pt-24 lg:pt-24 max-w-7xl w-full mx-auto transition-all duration-300 ${
            isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
