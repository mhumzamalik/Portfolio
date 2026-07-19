"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GithubIcon className="w-4 h-4" />,
      url: "https://github.com/mhumzamalik",
      label: "GitHub",
    },
    {
      icon: <LinkedinIcon className="w-4 h-4" />,
      url: "https://www.linkedin.com/in/mrmuhammadhamza88/",
      label: "LinkedIn",
    },
    {
      icon: <WhatsAppIcon className="w-4 h-4" />,
      url: "https://wa.me/923039494797",
      label: "WhatsApp",
    },
    {
      icon: <Mail className="w-4 h-4" />,
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=46humza@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            href="/"
            className="serif-title text-2xl text-white cursor-none"
          >
            Muhammad Hamza
          </Link>

          <span className="text-xs font-sans tracking-wide text-white">
            Full Stack Developer
          </span>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-full border border-white/20 bg-black text-white hover:bg-white hover:text-black transition-all duration-300 cursor-none shadow-sm"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <span className="text-[10px] font-sans text-white mt-1 leading-relaxed">
            &copy; {currentYear} Muhammad Hamza | All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}