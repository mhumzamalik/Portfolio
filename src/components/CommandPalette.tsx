"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight, X, Compass, Briefcase, Award, Zap, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

interface CommandItem {
  name: string;
  url: string;
  category: "Navigation" | "Project";
  icon?: React.ReactNode;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navCommands: CommandItem[] = [
    { name: "Home Portfolio", url: "/", category: "Navigation", icon: <Compass className="w-4 h-4" /> },
    { name: "About Biography", url: "/about", category: "Navigation", icon: <Award className="w-4 h-4" /> },
    { name: "All Projects Case Studies", url: "/projects", category: "Navigation", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Experience Timeline", url: "/experience", category: "Navigation", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Interactive Tech Stack", url: "/tech-stack", category: "Navigation", icon: <Zap className="w-4 h-4" /> },
    { name: "Services Offered", url: "/services", category: "Navigation", icon: <HelpCircle className="w-4 h-4" /> },
    { name: "Interactive Resume", url: "/resume", category: "Navigation", icon: <FileText className="w-4 h-4" /> },
    { name: "Contact & Hire Me", url: "/contact", category: "Navigation", icon: <ArrowRight className="w-4 h-4" /> },
  ];

  const projectCommands: CommandItem[] = projects.map((p) => ({
    name: p.title,
    url: `/projects/${p.id}`,
    category: "Project",
    icon: <Briefcase className="w-4 h-4" />,
  }));

  const allCommands = [...navCommands, ...projectCommands];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setSearch("");
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleNavigate = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleNavigate(filteredCommands[selectedIndex].url);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground border border-primary/20 shadow-2xl rounded-full flex items-center justify-center transition-all cursor-pointer outline-none"
        aria-label="Open command menu"
      >
        <Search className="w-5 h-5" />
      </motion.button>

      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xl z-50 flex items-start justify-center pt-24 px-4 transition-all duration-300"
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg premium-panel rounded-2xl overflow-hidden shadow-2xl transition-all"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 p-4 border-b border-stone-200 dark:border-stone-800">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages or projects..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground text-sm font-sans"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-stone-200/80 dark:hover:bg-[#1d2027] rounded transition cursor-none"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground font-sans">
                  No matching options found.
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigate(cmd.url)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-sans transition-all cursor-none ${
                      index === selectedIndex
                        ? "bg-stone-200/80 dark:bg-[#1d2027] text-foreground pl-4"
                        : "text-muted-foreground hover:bg-stone-100/70 dark:hover:bg-[#16181c]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cmd.icon}
                      <span>{cmd.name}</span>
                    </div>
                    <span className="text-xs uppercase opacity-40 font-medium tracking-widest">
                      {cmd.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="bg-stone-100/60 dark:bg-[#111214] p-3 border-t border-border/80 text-[10px] text-muted-foreground dark:text-muted-foreground font-sans flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

