"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface AdminHeaderProps {
  isSidebarCollapsed: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: {
    email?: string;
    fullName?: string;
  };
}

export default function AdminHeader({ isSidebarCollapsed, setIsMobileOpen, user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logoutAction();
    }
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview";
    if (pathname.startsWith("/admin/contacts")) return "Contact Queries";
    return "Admin Console";
  };

  const getBreadcrumbs = () => {
    if (pathname === "/admin") {
      return (
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground font-sans">
          <span>Admin</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Dashboard</span>
        </div>
      );
    }
    if (pathname.startsWith("/admin/contacts")) {
      return (
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground font-sans">
          <span>Admin</span>
          <span className="text-border">/</span>
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-border">/</span>
          <span className="text-foreground">Queries</span>
        </div>
      );
    }
    return null;
  };

  const getInitials = (name = "Admin User") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 transition-all duration-300 left-0 ${
        isSidebarCollapsed ? "lg:left-16" : "lg:left-64"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 border border-border rounded-xl bg-muted/50 hover:bg-muted transition cursor-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4 text-foreground" />
        </button>

        <div className="hidden sm:flex flex-col">
          {getBreadcrumbs()}
          <h1 className="serif-title text-lg font-semibold tracking-tight text-foreground mt-0.5 leading-none">
            {getPageTitle()}
          </h1>
        </div>
        <h1 className="sm:hidden serif-title text-base font-semibold tracking-tight text-foreground leading-none">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 border border-border rounded-full bg-muted/50 hover:bg-muted transition-all cursor-none"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full border border-border bg-muted/30 hover:bg-muted transition cursor-none"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-semibold select-none">
              {getInitials(user.fullName)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1 hidden sm:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user.fullName || "Admin User"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-sans">
                  {user.email || "admin@example.com"}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = "/admin";
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-muted transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Dashboard Home</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-500 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
