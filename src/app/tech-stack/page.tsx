"use client";

import { techSkills, Technology } from "@/data/tech";
import { Atom, Globe, ShieldAlert, Code2, Palette, Layers, RefreshCw, Server, Terminal, Link2, Database, Zap, Flame, Cloud, GitBranch, Cpu, MonitorPlay } from "lucide-react";
import { FramerIcon } from "@/components/SocialIcons";

export default function TechStackPage() {
  const categories = ["Frontend", "Backend", "Database", "Cloud", "Tools"] as const;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Atom":
        return <Atom className="w-5 h-5" />;
      case "Globe":
        return <Globe className="w-5 h-5" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5" />;
      case "Code2":
        return <Code2 className="w-5 h-5" />;
      case "Palette":
        return <Palette className="w-5 h-5" />;
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "RefreshCw":
        return <RefreshCw className="w-5 h-5" />;
      case "Server":
        return <Server className="w-5 h-5" />;
      case "Terminal":
        return <Terminal className="w-5 h-5" />;
      case "Link2":
        return <Link2 className="w-5 h-5" />;
      case "Database":
        return <Database className="w-5 h-5" />;
      case "DatabaseBackup":
        return <Database className="w-5 h-5" />;
      case "Zap":
        return <Zap className="w-5 h-5" />;
      case "Flame":
        return <Flame className="w-5 h-5" />;
      case "Cloud":
        return <Cloud className="w-5 h-5" />;
      case "GitBranch":
        return <GitBranch className="w-5 h-5" />;
      case "Container":
        return <Cpu className="w-5 h-5" />;
      case "Framer":
        return <FramerIcon className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[40%] right-[-150px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">04 / Stack</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Technologies & Tools
        </h1>
      </div>

      <div className="space-y-16">
        {categories.map((cat) => {
          const skillsInCategory = techSkills.filter((s) => s.category === cat);
          if (skillsInCategory.length === 0) return null;

          return (
            <div key={cat} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-border/40 pb-16 last:border-0 last:pb-0">
              <div className="lg:col-span-3">
                <h3 className="serif-title text-3xl text-foreground dark:text-foreground tracking-tight">
                  {cat}
                </h3>
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground dark:text-muted-foreground block mt-1">
                  {skillsInCategory.length} active integrations
                </span>
              </div>

              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsInCategory.map((tech) => (
                  <div
                    key={tech.name}
                    className="p-6 premium-card rounded-[24px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 border border-border/80 premium-surface rounded-xl text-primary flex items-center justify-center">
                            {getIcon(tech.icon)}
                          </div>
                          <h4 className="serif-title text-xl text-foreground dark:text-foreground font-normal">
                            {tech.name}
                          </h4>
                        </div>

                        <span className="text-[9px] uppercase font-sans tracking-widest px-2.5 py-0.5 border border-border rounded-full text-muted-foreground dark:text-muted-foreground bg-background">
                          {tech.level}
                        </span>
                      </div>

                      <p className="text-muted-foreground dark:text-muted-foreground text-xs md:text-sm font-sans leading-relaxed mb-6">
                        {tech.description}
                      </p>
                    </div>

                    {tech.projectsUsed.length > 0 && (
                      <div className="border-t border-border/40 pt-4 mt-auto">
                        <span className="text-[9px] uppercase font-sans tracking-widest text-muted-foreground block mb-2 flex items-center gap-1">
                          <MonitorPlay className="w-3 h-3 text-primary" />
                          <span>Projects Integration</span>
                        </span>

                        <div className="flex flex-wrap gap-1">
                          {tech.projectsUsed.map((proj, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-sans text-white bg-black border border-white/10 px-2 py-0.5 rounded"
                            >
                              {proj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

