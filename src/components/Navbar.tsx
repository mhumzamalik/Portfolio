"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Command } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Experience", path: "/experience" },
    { name: "Tech Stack", path: "/tech-stack" },
    { name: "Services", path: "/services" },
    { name: "Resume", path: "/resume" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-xl border-b border-border/80 transition-colors duration-300">
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="serif-title text-xl font-medium tracking-tight text-foreground flex items-center gap-1.5 cursor-none"
          >
            <span>Muhammad Hamza</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = mounted
                ? pathname === link.path || pathname.startsWith(link.path + "/")
                : false;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`premium-link text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-1.5 cursor-none ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
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

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-full border border-border/80 bg-stone-100/70 dark:bg-[#16181c] text-stone-900 dark:text-stone-100 hover:bg-stone-200/80 dark:hover:bg-[#242831] hover:scale-105 transition-all duration-300 cursor-none shadow-sm"
              aria-label="Toggle menu"
            >
              {isOpen
                ? <X className="w-4 h-4 text-stone-900 dark:text-white" />
                : <Menu className="w-4 h-4 text-stone-900 dark:text-white" />
              }
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 top-20 z-30 bg-background/95 backdrop-blur-2xl lg:hidden flex flex-col items-center justify-center gap-8 py-12 transition-all duration-300">
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => {
              const isActive = mounted ? pathname === link.path : false;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`serif-title text-3xl transition-all duration-300 cursor-none ${isActive
                    ? "text-foreground scale-105"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
