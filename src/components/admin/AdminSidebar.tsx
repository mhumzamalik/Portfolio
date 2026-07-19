"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  MessageSquare,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: {
    email?: string;
    fullName?: string;
  };
}

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      disabled: false,
    },
    {
      name: "Contact Queries",
      path: "/admin/contacts",
      icon: <Inbox className="w-4 h-4" />,
      disabled: false,
    },
    {
      name: "Live Chat",
      path: "/admin/chat",
      icon: <MessageSquare className="w-4 h-4" />,
      disabled: false,
    },
    {
      name: "Security",
      path: "/admin/security",
      icon: <ShieldCheck className="w-4 h-4" />,
      disabled: false,
    },
    {
      name: "Analytics",
      path: "#",
      icon: <BarChart3 className="w-4 h-4" />,
      disabled: true,
      tag: "Soon",
    },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logoutAction();
    }
  };

  const getInitials = (name = "Admin User") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between border-b border-border/60 mb-6 py-4 ${isCollapsed ? "px-3 justify-center" : "px-5"
          }`}
      >
        {!isCollapsed && (
          <Link
            href="/"
            className="serif-title text-lg font-medium tracking-tight text-foreground flex items-center gap-1.5 cursor-none"
          >
            <span>Admin Panel</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5" />
          </Link>
        )}

        {isCollapsed && (
          <Link
            href="/"
            className="serif-title text-xl font-bold text-primary flex items-center justify-center cursor-none"
          >
            A.
          </Link>
        )}

        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 border border-border rounded-lg hover:bg-muted transition"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`border-b border-border/60 pb-5 mb-5 flex items-center gap-3 ${isCollapsed ? "px-2 justify-center" : "px-5"
          }`}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-semibold select-none flex-shrink-0">
          {getInitials(user.fullName)}
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-foreground truncate">
              {user.fullName || "Admin User"}
            </h3>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold font-sans block mt-0.5">
              Administrator
            </span>
          </div>
        )}
      </div>

      <nav className={`flex-1 space-y-1.5 ${isCollapsed ? "px-2" : "px-3"}`}>
        {menuItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? pathname === "/admin"
              : item.path !== "#" && pathname.startsWith(item.path);

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-muted-foreground/50 cursor-not-allowed border border-transparent select-none`}
                title={`${item.name} is coming soon`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!isCollapsed && <span className="uppercase tracking-wider">{item.name}</span>}
                </div>
                {!isCollapsed && item.tag && (
                  <span className="text-[8px] tracking-wide font-sans bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {item.tag}
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl transition-all duration-200 border ${isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-border/60 pt-4 mt-auto ${isCollapsed ? "px-2" : "px-3"}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center gap-3 w-full px-4 py-2.5 mt-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground rounded-xl border border-transparent transition-all duration-200 cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-border bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out hidden lg:block ${isCollapsed ? "w-16" : "w-64"
          }`}
      >
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-45 bg-background/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
