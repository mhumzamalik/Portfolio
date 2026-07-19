"use client";

import { Printer, Download, MapPin, Mail, Calendar, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { experiences } from "@/data/experience";
import { techSkills } from "@/data/tech";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[20%] right-[-100px] print:hidden" />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border pb-8 mb-12 print:hidden">
        <Link
          href="/about"
          className="premium-link inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground dark:hover:text-foreground transition cursor-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to About</span>
        </Link>
        
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="premium-button-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition cursor-none"
          >
            <Printer className="w-4 h-4" />
            <span>Print Resume</span>
          </button>
        </div>
      </div>

      <div className="premium-panel p-8 md:p-12 rounded-[28px] print:border-0 print:shadow-none print:p-0 print-container">
        <div className="border-b border-border pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div>
            <h1 className="serif-title text-4xl md:text-5xl font-light text-foreground dark:text-foreground print:text-foreground mb-2">
              Muhammad Hamza
            </h1>
            <h2 className="text-sm font-sans tracking-widest text-primary dark:text-primary print:text-secondary uppercase font-semibold">
              Full Stack Developer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground dark:text-muted-foreground print:text-secondary font-sans">
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary print:text-foreground" />
              <span>46humza@gmail.com</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary print:text-foreground" />
              <span>Lahore, Pakistan</span>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary print:text-foreground" />
              <span>+92 303 9494797</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-primary print:text-foreground">Web:</span>
              <span>---------------</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-8">
            <section>
              <h3 className="serif-title text-xl uppercase tracking-wider text-foreground dark:text-foreground print:text-foreground border-b border-border pb-2 mb-6">
                Professional Experience
              </h3>
              
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="serif-title text-lg font-semibold text-foreground dark:text-foreground print:text-foreground">
                          {exp.role}
                        </h4>
                        <span className="text-xs font-semibold text-primary">{exp.company}</span>
                      </div>
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground font-sans text-right">
                        {exp.duration}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground print:text-foreground leading-relaxed font-sans">
                      {exp.description}
                    </p>

                    <div className="space-y-1.5 pl-3">
                      {exp.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-2 text-muted-foreground dark:text-muted-foreground print:text-secondary text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-primary print:bg-black rounded-full mt-1.5 flex-shrink-0" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-4 space-y-8">
            <section>
              <h3 className="serif-title text-xl uppercase tracking-wider text-foreground dark:text-foreground print:text-foreground border-b border-border pb-2 mb-4">
                Core Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {techSkills.map((tech) => (
                  <span
                    key={tech.name}
                    className="text-[10px] font-sans text-white dark:text-muted-foreground bg-stone-900 dark:bg-stone-900 border border-transparent dark:border-border px-2 py-0.5 rounded print:bg-white print:text-foreground"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="serif-title text-xl uppercase tracking-wider text-foreground dark:text-foreground print:text-foreground border-b border-border pb-2 mb-4">
                Education
              </h3>
              <div className="space-y-4">
                <div className="text-xs">
                  <span className="font-semibold text-foreground dark:text-foreground block">University of Central Punjab</span>
                  <span className="text-muted-foreground dark:text-muted-foreground">BS in Software Engineering</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">2020 - 2024</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-foreground dark:text-foreground block">Government College Farooq Abad</span>
                  <span className="text-muted-foreground dark:text-muted-foreground">FSc Pre-Engineering</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">2018 - 2020</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="serif-title text-xl uppercase tracking-wider text-foreground dark:text-foreground print:text-foreground border-b border-border pb-2 mb-4">
                Certifications
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground dark:text-foreground block">Advanced Web Engineering</span>
                  <span className="text-muted-foreground dark:text-muted-foreground">NAVTTC</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground dark:text-foreground block">MERN Stack</span>
                  <span className="text-muted-foreground dark:text-muted-foreground">PSDF</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, button, .custom-cursor, .custom-cursor-dot, .ambient-glow, .fixed {
            display: none !important;
          }
          .print-container {
            border: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

