"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  Mail,
  ArrowDown,
  Check,
  Code,
  Server,
  Database,
  Globe,
  Wrench,
  RefreshCw,
  GitBranch,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import { projects } from "@/data/projects";
import { techSkills } from "@/data/tech";
import { testimonials } from "@/data/testimonials";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    "Frontend" | "Backend" | "Database" | "Cloud" | "Tools"
  >("Frontend");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const stats = [
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 20, suffix: "+", label: "Projects Completed" },
    { value: 10, suffix: "+", label: "Technologies" },
    { value: 100, suffix: "%", label: "Responsive Design" },
  ];

  const services = [
    {
      title: "Frontend Development",
      desc: "Crafting beautiful, responsive, and performance-optimized user interfaces using React, Next.js, and Tailwind CSS.",
    },
    {
      title: "Backend Development",
      desc: "Building secure, scalable, and highly performant backend architectures with Node.js, Express, and Redis.",
    },
    {
      title: "Full Stack Solutions",
      desc: "Integrating frontend experiences with reliable database engines and BaaS solutions like Supabase or Firebase.",
    },
    {
      title: "API Development",
      desc: "Creating highly standardized REST APIs with detailed documentation, rate-limiting, and validation controls.",
    },
    {
      title: "Database Architecture",
      desc: "Designing schema relationships, relational constraints, indexing strategies in MongoDB and PostgreSQL.",
    },
    {
      title: "Performance Tuning",
      desc: "Improving page loading benchmarks (Lighthouse) through media compression, code-splitting, and caching.",
    },
  ];

  const processSteps = [
    {
      title: "Discovery",
      desc: "Understanding the product requirements, target demographics, and project goals.",
    },
    {
      title: "Planning",
      desc: "Defining architecture schemas, state structures, API routers, and project timelines.",
    },
    {
      title: "Design",
      desc: "Creating sleek editorial wireframes and converting them into strict Tailwind CSS style guides.",
    },
    {
      title: "Development",
      desc: "Writing clean, modular, and strongly typed code following TypeScript best practices.",
    },
    {
      title: "Testing",
      desc: "Running unit validations, accessibility audits, and cross-device responsiveness sweeps.",
    },
    {
      title: "Deployment",
      desc: "Configuring production hosting on platforms like Vercel with automated CI/CD sweeps.",
    },
    {
      title: "Maintenance",
      desc: "Monitoring performance telemetry and providing iterative scale features.",
    },
  ];

  const githubMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const githubWeeks = Array.from({ length: 24 });
  const githubDays = Array.from({ length: 7 });

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="ambient-glow top-[10%] left-[-200px]" />
      <div className="ambient-glow top-[50%] right-[-200px]" />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="premium-panel rounded-[36px] p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border/80 rounded-full premium-surface mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground">
                  Available for Freelance & Full-time
                </span>
              </div>

              <h1 className="serif-title text-5xl md:text-7xl font-light tracking-tight text-foreground dark:text-foreground leading-[1.05] mb-6">
                Muhammad Hamza
              </h1>
              <h2 className="text-xl md:text-2xl font-sans text-primary dark:text-cyan-300 tracking-wide uppercase font-medium mb-6">
                Full Stack Developer
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl font-sans leading-relaxed mb-10">
                Crafting minimal, luxury-styled, and highly scalable web
                applications. Specializing in Next.js, React, Node.js, and
                database performance tuning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/projects"
                  className="premium-button-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-sans font-medium tracking-wide uppercase cursor-none"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="premium-button-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-sans font-medium tracking-wide uppercase cursor-none"
                >
                  <Mail className="w-4 h-4" />
                  <span>Hire Me</span>
                </Link>
                <Link
                  href="/MuhammadHamza.pdf"
                  className="inline-flex items-center justify-center gap-2 border border-border/80 bg-white/30 dark:bg-white/5 text-foreground px-6 py-4 rounded-full text-sm font-sans font-medium tracking-wide uppercase transition-all duration-300 cursor-none hover:bg-white/60 dark:hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-[420px] md:w-80 md:h-[460px]">
                <div className="absolute inset-0 border border-border/80 rounded-[140px] transform translate-x-3 translate-y-3 z-0" />
                <div className="absolute inset-0 premium-card rounded-[140px] overflow-hidden z-10">
                  <Image
                    src="/profile.png"
                    alt="Muhammad Hamza Profile"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 md:mt-20">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground transition cursor-none"
          >
            <span className="text-[10px] uppercase tracking-widest font-sans font-medium">
              Scroll Down
            </span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </section>

      <section
        id="about"
        className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border"
      >
        <div className="premium-card rounded-[32px] p-8 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
              01 / Biography
            </span>
            <h3 className="serif-title text-4xl text-foreground dark:text-foreground">
              About
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="serif-title text-2xl md:text-3xl text-foreground dark:text-muted-foreground leading-relaxed font-light mb-8">
              &ldquo;Building modern web applications requires a balance between
              strict architecture, clean databases, and absolute visual
              elegance.&rdquo;
            </p>
            <div className="text-muted-foreground font-sans text-sm leading-relaxed space-y-6 max-w-2xl">
              <p>
                As a Full Stack JavaScript Developer, I&apos;ve spent the last 2+
                years designing and launching applications that handle heavy
                relational state databases, clean server authentication, and
                micro-interactions. My passion is building minimal, luxury
                interfaces that feel light, fast, and optimized on any device.
              </p>
              <p>
                From deploying distributed node clusters to setting up Postgres
                real-time channels with Supabase, I focus heavily on writing
                modular, self-documenting code.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="premium-card flex flex-col items-center text-center p-6 rounded-2xl"
              >
                <span className="text-4xl md:text-5xl font-light text-foreground dark:text-foreground mb-2 font-serif">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
            02 / Technologies
          </span>
          <h3 className="serif-title text-4xl md:text-5xl text-foreground dark:text-foreground mb-6">
            Expertise Stack
          </h3>
          <p className="text-muted-foreground text-sm font-sans">
            Modularly grouped skills highlighting level of proficiency and
            practical application.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {(["Frontend", "Backend", "Database", "Cloud", "Tools"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest font-medium transition cursor-none ${activeTab === tab
                  ? "premium-button-primary"
                  : "border border-border/80 text-muted-foreground dark:text-muted-foreground hover:bg-white/10 dark:hover:bg-white/10"
                  }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techSkills
            .filter((t) => t.category === activeTab)
            .map((tech) => (
              <div
                key={tech.name}
                className="p-6 premium-card rounded-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="serif-title text-xl text-foreground dark:text-foreground">
                    {tech.name}
                  </h4>
                  <span className="text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 border border-border rounded-full text-muted-foreground dark:text-muted-foreground">
                    {tech.level}
                  </span>
                </div>
                <p className="text-muted-foreground dark:text-muted-foreground text-xs font-sans leading-relaxed mb-4">
                  {tech.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tech.projectsUsed.slice(0, 2).map((proj, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-sans text-white bg-stone-900 border border-white/10 px-2 py-0.5 rounded"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
              03 / Case Studies
            </span>
            <h3 className="serif-title text-4xl md:text-5xl text-foreground dark:text-foreground">
              Featured Projects
            </h3>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-foreground dark:text-foreground hover:text-primary transition cursor-none group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.slice(0, 2).map((project) => (
            <div
              key={project.id}
              className="premium-card rounded-[24px] overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative h-64 md:h-80 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] border-b border-border/80 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 dark:opacity-25 bg-[radial-gradient(#6ee7f9_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="z-10 p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-white/10 flex items-center justify-center border border-border/70 mb-4 text-primary">
                    <Code className="w-8 h-8" />
                  </div>
                  <h4 className="serif-title text-3xl text-foreground dark:text-foreground mb-2">
                    {project.title}
                  </h4>
                  <span className="text-[10px] uppercase font-sans tracking-widest bg-background border border-border px-3 py-1 rounded-full text-muted-foreground">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-sans !text-white bg-stone-900 border border-white/10 px-2.5 py-1 rounded-full dark:!text-white dark:bg-stone-900 dark:border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-foreground dark:text-foreground hover:text-primary transition cursor-none"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
            04 / Capabilities
          </span>
          <h3 className="serif-title text-4xl md:text-5xl text-foreground dark:text-foreground mb-6">
            Development Services
          </h3>
          <p className="text-muted-foreground text-sm font-sans">
            Full-stack web execution built strictly around clean rendering
            standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="p-8 premium-card rounded-[24px] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 border border-border rounded-xl flex items-center justify-center text-primary mb-6">
                {idx === 0 && <Code className="w-5 h-5" />}
                {idx === 1 && <Server className="w-5 h-5" />}
                {idx === 2 && <Globe className="w-5 h-5" />}
                {idx === 3 && <RefreshCw className="w-5 h-5" />}
                {idx === 4 && <Database className="w-5 h-5" />}
                {idx === 5 && <Wrench className="w-5 h-5" />}
              </div>
              <h4 className="serif-title text-xl text-foreground dark:text-foreground mb-4">
                {service.title}
              </h4>
              <p className="text-muted-foreground dark:text-muted-foreground text-xs font-sans leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
            05 / Methodology
          </span>
          <h3 className="serif-title text-4xl md:text-5xl text-foreground dark:text-foreground mb-6">
            Development Process
          </h3>
          <p className="text-muted-foreground text-sm font-sans">
            How I guide a project from initial scoping down to final production
            launch.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[1px] bg-border transform lg:-translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""} relative gap-8`}
                >
                  <div className="absolute left-6 lg:left-1/2 w-4 h-4 bg-background border border-primary rounded-full transform lg:-translate-x-1/2 mt-1.5 hidden md:block" />

                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right flex flex-col md:items-end">
                    {isEven ? (
                      <div className="max-w-md premium-card rounded-2xl p-6">
                        <span className="text-[10px] uppercase font-sans tracking-widest text-primary font-semibold">
                          Step 0{idx + 1}
                        </span>
                        <h4 className="serif-title text-2xl text-foreground dark:text-foreground mt-1 mb-3">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground dark:text-muted-foreground text-xs font-sans leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="w-full md:w-1/2 pl-12 md:pl-12 text-left">
                    {!isEven ? (
                      <div className="max-w-md premium-card rounded-2xl p-6">
                        <span className="text-[10px] uppercase font-sans tracking-widest text-primary font-semibold">
                          Step 0{idx + 1}
                        </span>
                        <h4 className="serif-title text-2xl text-foreground dark:text-foreground mt-1 mb-3">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground dark:text-muted-foreground text-xs font-sans leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
              06 / Contribution telemetry
            </span>
            <h3 className="serif-title text-4xl text-foreground dark:text-foreground mb-6">
              GitHub Activity
            </h3>
            <p className="text-muted-foreground text-sm font-sans leading-relaxed">
              Consistently shipping and iterating. I maintain open-source
              projects, CLI tools, and libraries directly on GitHub.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/mhumzamalik"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-medium text-foreground bg-transparent hover:bg-foreground hover:text-background transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.08)] cursor-none"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 premium-panel p-6 rounded-[24px]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-sans font-semibold text-foreground dark:text-foreground">
                342 Contributions in the last year
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-sans">
                Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <div className="flex justify-between pl-6 pr-2 mb-2 text-[10px] font-sans text-muted-foreground">
                  {githubMonths.map((m, i) => (
                    <span key={i}>{m}</span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col gap-1 text-[8px] font-sans text-muted-foreground pr-2 pt-1 justify-between h-20">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>
                  <div className="flex gap-1 flex-grow">
                    {githubWeeks.map((_, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1">
                        {githubDays.map((_, dIdx) => {
                          const level = (wIdx * 3 + dIdx * 7) % 4; 
                          return (
                            <div
                              key={dIdx}
                              className={`w-2.5 h-2.5 rounded-[2px] transition-colors ${level === 0
                                ? "bg-stone-200 dark:bg-stone-850"
                                : level === 1
                                  ? "bg-primary/20"
                                  : level === 2
                                    ? "bg-primary/50"
                                    : "bg-primary"
                                }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans mt-6">
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="w-2 h-2 rounded-[1px] bg-stone-200 dark:bg-stone-850" />
                <div className="w-2 h-2 rounded-[1px] bg-primary/20" />
                <div className="w-2 h-2 rounded-[1px] bg-primary/50" />
                <div className="w-2 h-2 rounded-[1px] bg-primary" />
                <span>More</span>
              </div>
              <span>Stats synced via live GraphQL API fallback</span>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-stone-100/30 dark:bg-stone-950/10 border-b border-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-muted-foreground dark:text-muted-foreground block mb-2">
              07 / Client Reviews
            </span>
            <h3 className="serif-title text-4xl text-foreground dark:text-foreground mb-16">
              Client Testimonials
            </h3>

            <div className="relative min-h-[220px] flex items-center justify-center px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <p className="serif-title text-xl md:text-2xl text-foreground dark:text-muted-foreground italic leading-relaxed max-w-3xl mb-8">
                    &ldquo;{testimonials[testimonialIndex].feedback}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-sans font-semibold text-foreground dark:text-foreground">
                        {testimonials[testimonialIndex].name}
                      </span>
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                        {testimonials[testimonialIndex].role},{" "}
                        {testimonials[testimonialIndex].company}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-border rounded-full hover:bg-stone-250 dark:hover:bg-stone-850 hover:text-primary transition cursor-none"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 border border-border rounded-full hover:bg-stone-250 dark:hover:bg-stone-850 hover:text-primary transition cursor-none"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 text-center">
        <div className="bg-stone-900 text-white dark:bg-stone-950 border border-stone-850 p-12 md:p-24 rounded-[40px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-stone-400 block mb-4">
              Let&apos;s collaborate
            </span>
            <h3 className="serif-title text-4xl md:text-6xl font-light tracking-tight mb-8 leading-tight">
              Ready to build something amazing together?
            </h3>
            <p className="text-stone-300 text-sm md:text-base font-sans mb-12 max-w-lg leading-relaxed">
              If you have a project idea, a position to fill, or just want to
              connect, feel free to drop a message.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-500"
            >
              <span>Hire Me</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
