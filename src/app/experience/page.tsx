import { experiences } from "@/data/experience";
import { Briefcase, MapPin, Calendar, Award } from "lucide-react";

export default function ExperiencePage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[30%] left-[-150px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">03 / History</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Professional Timeline
        </h1>
      </div>

      <div className="relative border-l border-border pl-8 md:pl-12 space-y-16 max-w-4xl">
        {experiences.map((exp, idx) => (
          <div key={exp.id} className="relative group">
            <div className="absolute -left-[37px] md:-left-[53px] top-1.5 w-4 h-4 bg-background border border-primary rounded-full group-hover:scale-125 transition-transform duration-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>

            <div className="space-y-4 premium-card rounded-[24px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="serif-title text-2xl md:text-3xl text-foreground dark:text-foreground font-normal leading-snug">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                    <span>{exp.company}</span>
                    <span className="text-muted-foreground font-normal">&bull;</span>
                    <span className="text-muted-foreground font-normal text-xs">{exp.type}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </span>
                  <span className="flex items-center gap-1 sm:justify-end">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl">
                {exp.description}
              </p>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground block mb-1">Key Contributions</span>
                <div className="space-y-2">
                  {exp.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex gap-3 text-muted-foreground text-xs leading-relaxed max-w-2xl">
                      <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground block mb-2">Technologies Used</span>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-sans text-white dark:text-muted-foreground bg-stone-900 dark:bg-white/[0.03] border border-transparent dark:border-border/80 px-2.5 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

