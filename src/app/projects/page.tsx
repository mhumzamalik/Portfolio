"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Code } from "lucide-react";
import { projects } from "@/data/projects";

type CategoryFilter = "All" | "React" | "Next.js" | "Node.js" | "MongoDB" | "Supabase" | "Full Stack";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");

  const categories: CategoryFilter[] = ["All", "React", "Next.js", "Node.js", "MongoDB", "Supabase", "Full Stack"];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      project.category === selectedCategory ||
      project.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[15%] right-[-100px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">02 / Portfolio</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Case Studies & Works
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12">
        <div className="relative w-full md:w-80 flex items-center premium-surface rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-foreground dark:text-foreground placeholder-muted-foreground text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition cursor-none ${selectedCategory === cat
                  ? "premium-button-primary"
                  : "border border-border/80 text-muted-foreground dark:text-muted-foreground hover:bg-white/10 dark:hover:bg-white/10"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-xl">
          <p className="text-sm">No projects match your active filter search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="premium-card rounded-[24px] overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 md:h-64 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] border-b border-border/80 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(#6ee7f9_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="z-10 text-center p-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-white/10 flex items-center justify-center border border-border/70 mb-3 text-primary">
                      <Code className="w-6 h-6" />
                    </div>
                    <h4 className="serif-title text-2xl text-foreground dark:text-foreground mb-1">{project.title}</h4>
                    <span className="text-[9px] uppercase font-sans tracking-widest bg-background border border-border px-2.5 py-0.5 rounded-full text-muted-foreground">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-muted-foreground text-xs md:text-sm font-sans leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-sans !text-white bg-stone-900 border border-white/10 px-2 py-0.5 rounded dark:!text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-border/40 bg-white/30 dark:bg-white/[0.03] flex items-center justify-between">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-foreground dark:text-foreground hover:text-primary transition cursor-none"
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{project.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

