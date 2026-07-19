"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Mail, Phone, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "Full Stack Development",
      budget: "$2k - $5k",
      subject: "",
      message: "",
      agree: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to transmit message. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network response failed. Please check connection.");
    }
  };

  const socialLinks = [
    { icon: <GithubIcon className="w-4 h-4" />, url: "https://github.com/mhumzamalik", label: "GitHub" },
    { icon: <LinkedinIcon className="w-4 h-4" />, url: "https://linkedin.com/in/mrmuhammadhamza88", label: "LinkedIn" },
    { icon: <WhatsAppIcon className="w-4 h-4" />, url: "https://wa.me/923001234567", label: "WhatsApp" },
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6 font-sans relative overflow-hidden">
      <div className="ambient-glow top-[35%] left-[-200px]" />

      <div className="border-b border-border pb-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-muted-foreground font-medium block mb-2">06 / Collab</span>
        <h1 className="serif-title text-5xl md:text-7xl text-foreground dark:text-foreground tracking-tight leading-[1.05]">
          Start a Conversation
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Availability Status</span>
            <p className="serif-title text-2xl text-foreground dark:text-foreground">
              Actively booking freelance contracts and full-stack partnerships.
            </p>
          </div>

          <div className="space-y-6 border-t border-border pt-8">
            <div className="flex items-start gap-4">
              <div className="p-2 border border-border bg-stone-100 dark:bg-stone-900 text-primary rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-muted-foreground block">Location</span>
                <span className="text-sm font-semibold text-foreground dark:text-foreground">Lahore, Pakistan (UTC+5)</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 border border-border bg-stone-100 dark:bg-stone-900 text-primary rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-muted-foreground block">Direct Email</span>
                <span className="text-sm font-semibold text-foreground dark:text-foreground">46humza@gmail.com</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 border border-border bg-stone-100 dark:bg-stone-900 text-primary rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-sans text-muted-foreground block">Direct Telephone</span>
                <span className="text-sm font-semibold text-foreground dark:text-foreground">+92 303 9494797</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground block">Follow Core Accounts</span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-border rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-primary transition cursor-none"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 premium-panel p-8 md:p-12 rounded-[32px]">
          {status === "success" ? (
            <div className="text-center py-12 space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 flex items-center justify-center border border-green-200">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="serif-title text-3xl text-foreground dark:text-foreground">Transmission Successful</h3>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Muhammad Hamza has received your inquiry and will respond within 24 business hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 premium-button-secondary px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition cursor-none"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-rose-500/10 text-rose-400 text-xs rounded-xl border border-rose-400/20">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition"
                  />
                  {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition"
                  />
                  {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    {...register("phone")}
                    placeholder="+92 303 1234567"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="company" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    {...register("company")}
                    placeholder="Enter your company name"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition"
                  />
                  {errors.company && <span className="text-[10px] text-red-500">{errors.company.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="service" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Service Required *
                  </label>
                  <select
                    id="service"
                    {...register("service")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition cursor-none"
                  >
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="API Design">API Design & Setup</option>
                    <option value="Database Optimization">Database Optimization</option>
                    <option value="Performance Audit">Performance Audit</option>
                    <option value="Other">Other Consulting</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="budget" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Estimated Budget *
                  </label>
                  <select
                    id="budget"
                    {...register("budget")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition cursor-none"
                  >
                    <option value="Under $2k">Under $2k</option>
                    <option value="$2k - $5k">$2k - $5k</option>
                    <option value="$5k - $10k">$5k - $10k</option>
                    <option value="$10k+">$10k+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Subject *
                  </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject")}
                  placeholder="Project Collaboration Brief"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs md:text-sm text-foreground dark:text-foreground outline-none focus:border-stone-400 dark:focus:border-stone-700 transition"
                />
                {errors.subject && <span className="text-[10px] text-red-500">{errors.subject.message}</span>}
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Detailed Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  placeholder="Please describe your project scope, targets, timeline, and dependencies..."
                  className="premium-input w-full rounded-xl px-4 py-3 text-xs md:text-sm outline-none resize-none"
                />
                {errors.message && <span className="text-[10px] text-red-500">{errors.message.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-none">
                  <input
                    type="checkbox"
                    {...register("agree")}
                    className="w-4 h-4 accent-cyan-400 rounded border-border outline-none transition cursor-none"
                  />
                  <span className="text-[11px] text-muted-foreground dark:text-muted-foreground leading-normal">
                    I agree to the privacy policy and consent to storing this data. *
                  </span>
                </label>
                {errors.agree && <span className="text-[10px] text-red-500 block">{errors.agree.message}</span>}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="premium-button-primary w-full flex items-center justify-center gap-2 py-4.5 rounded-full text-xs uppercase tracking-widest font-semibold disabled:opacity-50 disabled:scale-100 transition duration-300 cursor-none"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Data...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

