import Link from "next/link";
import { Award, Target, Heart, GraduationCap, Trophy, ChevronRight, FileText } from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "Visual & Technical Precision", desc: "I write clean, modular layouts matching perfect styling tokens. Every pixel and margin must serve readability and purpose." },
    { title: "Continuous Iteration", desc: "Software is never complete. I build apps prepared for scalable upgrades, clean state expansions, and strict API expansions." },
    { title: "Multiplayer Coherence", desc: "Collaborating with design, product, and QA engineers is key. I document code, create schemas, and write self-explanatory commit messages." }
  ];

  const goals = [
    { title: "Database Scale Architecting", desc: "Developing highly concurrent relational models and clustering pipelines that handle millions of requests safely." },
    { title: "Editorial UI & Interaction", desc: "Advocating for premium web design, visual animations, and absolute speed on low-bandwidth connections." }
  ];

  const achievements = [
    { title: "Migrated Enterprise SaaS to Next.js App Router", context: "Decreased initial bundle sizes by 35% and boosted page loading speed to 98% in performance sweeps." },
    { title: "Engineered Redis Job Processor", context: "Processed up to 5,000 parallel jobs per second for distributed background workers." },
    { title: "Developed Open-source React Component libraries", context: "Over 5k downloads in active NPM modules, helping devs implement lightweight layout transitions." }
  ];

  const education = [
    { degree: "Bachelor of Science in software Engineering", school: "University of Central Punjab", year: "2020 - 2024" },
    { degree: "Intermediate in Pre-Engineering", school: "Government College Farooq Abad", year: "2018 - 2020" }
  ];

  const certificates = [
    { name: "Advance Web Engineering", issuer: "NAVTTC", year: "2024" },
    { name: "MERN Stack", issuer: "PSDF", year: "2024" },
  ];

  const softSkills = [
    "Clear Written & Verbal Communication",
    "Active Problem Solver & Analyst",
    "Self-directed Time Manager",
    "Empathetic Team Mentor",
    "Agile Scrum Collaborator"
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[20%] left-[-150px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">About / Muhammad Hamza</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Architecting Visual & Code Harmony
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        <div className="lg:col-span-8 space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <p className="serif-title text-2xl md:text-3xl text-foreground dark:text-foreground leading-relaxed font-light">
            My name is Muhammad Hamza, and I build high-performance interactive interfaces that bridge client aesthetics with fault-tolerant server systems.
          </p>
          <p>
            With over 2 years of professional developer experience, I specialize in the React, Next.js, and Node.js ecosystems. I focus heavily on writing clean, strongly typed codebases that adapt to production workflows effortlessly. I work extensively with relational databases (PostgreSQL/Supabase) and document models (MongoDB).
          </p>
          <p>
            I believe that developer experience directly affects user experience. Creating self-documenting APIs, utilizing modern design tokens, and auditing applications for accessibility under WCAG rules is a core part of my engineering approach.
          </p>

          <div className="pt-6">
            <Link
              href="/resume"
              className="premium-button-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition cursor-none"
            >
              <FileText className="w-4 h-4" />
              <span>Download & Print Resume</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-6 border border-border bg-stone-50/50 dark:bg-stone-950/20 rounded-xl">
            <h4 className="serif-title text-lg text-foreground dark:text-foreground flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span>Core Values</span>
            </h4>
            <div className="space-y-4">
              {values.map((v, i) => (
                <div key={i} className="text-xs">
                  <span className="font-semibold text-foreground dark:text-foreground block mb-1">{v.title}</span>
                  <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border border-border bg-stone-50/50 dark:bg-stone-950/20 rounded-xl">
            <h4 className="serif-title text-lg text-foreground dark:text-foreground flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span>Long-Term Goals</span>
            </h4>
            <div className="space-y-4">
              {goals.map((g, i) => (
                <div key={i} className="text-xs">
                  <span className="font-semibold text-foreground dark:text-foreground block mb-1">{g.title}</span>
                  <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div>
            <h3 className="serif-title text-3xl text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Key Achievements</span>
            </h3>
            <div className="space-y-6">
              {achievements.map((ach, i) => (
                <div key={i} className="border-l-2 border-primary pl-4 py-1">
                  <h4 className="serif-title text-lg text-foreground dark:text-foreground font-medium">{ach.title}</h4>
                  <p className="text-muted-foreground dark:text-muted-foreground text-xs font-sans mt-1 leading-relaxed">{ach.context}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="serif-title text-3xl text-foreground dark:text-foreground mb-6">Professional Journey</h3>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-lg font-sans">
              I started programming web applications as a hobbyist in 2020. This quickly turned into my academic focus at COMSATS University and then my professional career, where I started resolving UI performance lag issues and data syncing roadblocks for scaling agencies. I continuously pursue masters patterns in system caching and editorial interfaces.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="serif-title text-3xl text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Academic Education</span>
            </h3>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="serif-title text-lg text-foreground dark:text-foreground">{edu.degree}</h4>
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground font-sans">{edu.school}</span>
                  </div>
                  <span className="text-xs font-semibold font-sans text-foreground dark:text-muted-foreground">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="serif-title text-3xl text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Certificates</span>
            </h3>
            <div className="space-y-6">
              {certificates.map((cert, i) => (
                <div key={i} className="flex justify-between items-start gap-4 border-b border-border/40 pb-4">
                  <div>
                    <h4 className="serif-title text-lg text-foreground dark:text-foreground">{cert.name}</h4>
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground font-sans">{cert.issuer}</span>
                  </div>
                  <span className="text-xs font-semibold font-sans text-foreground dark:text-muted-foreground">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="serif-title text-3xl text-foreground dark:text-foreground mb-6">Soft Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((s, i) => (
                <span
                  key={i}
                  className="px-4 py-2 border border-border/80 rounded-full text-xs font-sans text-muted-foreground bg-white/30 dark:bg-white/[0.03]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

