import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ShieldCheck, Cpu, Code2, AlertTriangle, CheckSquare } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[10%] left-[-150px]" />

      <div className="mb-10">
        <Link
          href="/projects"
          className="premium-link inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground dark:hover:text-foreground transition cursor-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <div className="border-b border-border pb-10 mb-16">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-[10px] uppercase font-sans tracking-widest premium-surface px-3 py-1 rounded-full text-muted-foreground dark:text-muted-foreground">
            {project.category}
          </span>
          <span className="text-xs text-muted-foreground font-sans">{project.duration}</span>
        </div>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05] mb-6">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <span>The Problem</span>
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>The Solution</span>
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {project.solution}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <span>System Architecture & Stack Integration</span>
            </h3>
            <ul className="space-y-3 pl-2">
              {project.architecture.map((item, index) => (
                <li key={index} className="flex gap-3 text-muted-foreground text-xs md:text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-500" />
              <span>Key Features Built</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span>Engineering Challenges</span>
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {project.challenges}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="serif-title text-2xl text-foreground dark:text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>Outcome & Results</span>
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {project.results}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-6 premium-card rounded-[24px] space-y-6">
            <div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground block mb-1">My Role</span>
              <span className="text-sm font-semibold text-foreground dark:text-foreground">{project.role}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground block mb-1">Duration</span>
              <span className="text-sm font-semibold text-foreground dark:text-foreground">{project.duration}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground block mb-1">Core Tech Stack</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-sans text-white dark:text-muted-foreground bg-stone-900 dark:bg-stone-900 border border-transparent dark:border-border px-2.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button-primary w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition cursor-none"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Demo</span>
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button-secondary w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition cursor-none"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Codebase</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
