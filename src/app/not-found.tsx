import Link from "next/link";
import { ArrowRight, CornerDownRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-28 md:py-36 max-w-7xl mx-auto px-6 font-sans relative flex flex-col items-center justify-center text-center min-h-[60vh] overflow-hidden">
      <div className="ambient-glow top-[20%] left-[-200px]" />
      
      <h1 className="serif-title text-[10rem] md:text-[14rem] font-light leading-none text-muted-foreground dark:text-foreground select-none">
        404
      </h1>
      
      <div className="max-w-md space-y-6">
        <h2 className="serif-title text-3xl md:text-4xl text-foreground dark:text-foreground font-normal">
          Page Not Found
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground text-xs md:text-sm leading-relaxed">
          The requested resource has been relocated, deleted, or does not exist. Please navigate back using the command panel (Ctrl+K) or selection cards below.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-6 text-left">
          <Link
            href="/"
            className="p-4 border border-border bg-stone-50/50 dark:bg-stone-950/20 hover:border-stone-400 dark:hover:border-stone-850 rounded-xl group flex flex-col justify-between transition cursor-none"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">01</span>
            <span className="text-xs font-semibold text-foreground dark:text-foreground flex items-center gap-1 mt-2">
              <span>Home Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
          <Link
            href="/projects"
            className="p-4 border border-border bg-stone-50/50 dark:bg-stone-950/20 hover:border-stone-400 dark:hover:border-stone-850 rounded-xl group flex flex-col justify-between transition cursor-none"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">02</span>
            <span className="text-xs font-semibold text-foreground dark:text-foreground flex items-center gap-1 mt-2">
              <span>Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

