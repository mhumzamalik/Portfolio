"use client";

import { useState } from "react";
import { Code, Server, Globe, Database, RefreshCw, Wrench, HelpCircle, ChevronDown, Check } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function ServicesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const services = [
    {
      title: "Frontend Development",
      desc: "Developing fast, responsive, and pixel-perfect user interfaces matching typography tokens. Expert in component structures using React, Next.js, and Tailwind CSS.",
      features: ["Single Page Applications (SPAs)", "Server-Side Rendering (SSR)", "Responsive Layouts (Mobile first)", "Web Accessibility (WCAG) compliance"]
    },
    {
      title: "Backend Development",
      desc: "Creating secure, scalable, and cluster-based server architectures that process inputs securely. Expert in REST APIs using Node.js, Express, and Redis.",
      features: ["Scalable Express.js servers", "Distributed job worker queues", "Security middleware integration", "Third-party payment gateways (Stripe)"]
    },
    {
      title: "Full Stack Development",
      desc: "Consolidating client interfaces with robust data syncing loops, state validations, and server-side routes in Next.js App Router.",
      features: ["Next.js App-router integration", "BaaS syncs (Supabase, Firebase)", "User Authentication (OAuth, RLS)", "Optimistic UI rendering patterns"]
    },
    {
      title: "API Development & Design",
      desc: "Designing clean, RESTful APIs using standard status codes, rate limiters, validation layers (Zod), and structured response formats.",
      features: ["Standardized REST routes", "Request validation (Zod)", "API Rate Limiting & CORS", "Interactive OpenAPI/Swagger doc formats"]
    },
    {
      title: "Database Design & Optimization",
      desc: "Mapping relational schemas and non-relational document databases. Optimizing indexing systems and aggregation queries for maximum speed.",
      features: ["PostgreSQL schema constraints", "MongoDB aggregation pipelines", "Index query optimization", "Automated backups & migrations"]
    },
    {
      title: "Performance Tuning",
      desc: "Conducting diagnostic sweeps to resolve lag, caching bottlenecks, and bulky initial bundle payloads. Raising Lighthouse scores above 95.",
      features: ["Bundle size minification", "Server-side page pre-fetching", "CDN asset caching configuration", "Image lazy-loading & responsive sizes"]
    }
  ];

  const processSteps = [
    { num: "01", title: "Discovery", desc: "Consulting to define project metrics, key features, user flows, and technical scopes." },
    { num: "02", title: "Planning", desc: "Mapping Postgres schemas, state trees, layout routing, and server clusters." },
    { num: "03", title: "Design", desc: "Refining visual layouts and setting typography, spacing, and color tokens." },
    { num: "04", title: "Development", desc: "Writing clean, modular, and strongly typed TS code under git version controls." },
    { num: "05", title: "Testing", desc: "Executing responsiveness tests across iOS, Android, and Desktop viewports." },
    { num: "06", title: "Deployment", desc: "Launching production bundles to Vercel with clean domains and CI/CD pipelines." },
    { num: "07", title: "Maintenance", desc: "Updating frameworks, monitoring server performance logs, and expanding features." }
  ];

  const faqs: FAQItem[] = [
    {
      question: "What is your main technology stack?",
      answer: "I specialize in the Full Stack JavaScript ecosystem, primarily React.js, Next.js (App Router), TypeScript, Tailwind CSS, Node.js, Express.js, Supabase, PostgreSQL, and MongoDB."
    },
    {
      question: "How do you ensure web application performance?",
      answer: "I utilize Next.js Server Components to reduce initial Javascript payloads, optimize image resolutions dynamically, execute client data caching using React Query, optimize database indexes, and implement Redis queues for long-running processes."
    },
    {
      question: "Do you sign Non-Disclosure Agreements (NDAs)?",
      answer: "Yes, I am fully open to signing NDAs before reviewing detailed product briefs or proprietary codebase architectures."
    },
    {
      question: "What is your standard turnaround time for a project?",
      answer: "Timeline depends on complexity: standard landing pages and portfolios take 1 to 2 weeks, while full-featured SaaS dashboards and e-commerce websites average 4 to 8 weeks from design to deployment."
    },
    {
      question: "How do we collaborate and communicate during development?",
      answer: "I use Slack or Discord for daily updates, GitHub for version control and issue tracking, and scheduled Zoom/Google Meet calls for progress walkthroughs at key milestones."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[25%] left-[-150px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">05 / Capabilities</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Services & Capabilities
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {services.map((s, idx) => (
          <div
            key={idx}
            className="p-8 premium-card rounded-[24px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 premium-surface rounded-xl flex items-center justify-center text-primary mb-6">
                {idx === 0 && <Code className="w-5 h-5" />}
                {idx === 1 && <Server className="w-5 h-5" />}
                {idx === 2 && <Globe className="w-5 h-5" />}
                {idx === 3 && <RefreshCw className="w-5 h-5" />}
                {idx === 4 && <Database className="w-5 h-5" />}
                {idx === 5 && <Wrench className="w-5 h-5" />}
              </div>

              <h3 className="serif-title text-2xl text-foreground dark:text-foreground mb-4">{s.title}</h3>
              <p className="text-muted-foreground dark:text-muted-foreground text-xs md:text-sm leading-relaxed mb-6">
                {s.desc}
              </p>
            </div>

            <div className="border-t border-border/40 pt-4 space-y-2">
              {s.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-16 mb-24">
        <h3 className="serif-title text-3xl md:text-4xl text-foreground dark:text-foreground mb-12">
          Methodological Process
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <div key={idx} className="p-6 premium-card rounded-[24px]">
              <span className="text-xs font-semibold text-primary font-sans block mb-1">
                Step {step.num}
              </span>
              <h4 className="serif-title text-xl text-foreground dark:text-foreground mb-3">
                {step.title}
              </h4>
              <p className="text-muted-foreground dark:text-muted-foreground text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-16 max-w-3xl mx-auto">
        <h3 className="serif-title text-3xl md:text-4xl text-foreground dark:text-foreground text-center mb-12 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-border/80 rounded-[20px] premium-surface overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm md:text-base font-semibold text-foreground dark:text-foreground hover:bg-white/10 transition cursor-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transform transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 border-t border-border/40 text-xs md:text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed bg-white/20 dark:bg-white/[0.03]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

