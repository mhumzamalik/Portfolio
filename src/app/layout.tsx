import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ChatWidget from "@/components/ChatWidget";
import AiChatButton from "@/components/AiChatButton";

import { headers } from "next/headers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-name",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-name",
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Hamza | Full Stack Developer",
    template: "%s | Muhammad Hamza",
  },
  description: "Muhammad Hamza is a premium Full Stack JavaScript Developer with over 2 years of professional experience building scalable web applications with React, Next.js, Node.js, and Supabase.",
  keywords: ["Muhammad Hamza", "Full Stack Developer", "JavaScript", "TypeScript", "Next.js", "React.js", "Node.js", "Portfolio"],
  authors: [{ name: "Muhammad Hamza" }],
  creator: "Muhammad Hamza",
  metadataBase: new URL("https://mhamza.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mhamza.dev",
    title: "Muhammad Hamza | Full Stack JavaScript Developer",
    description: "Premium personal portfolio of Muhammad Hamza, showcasing scalable web applications built with Next.js, React, Node.js, and modern databases.",
    siteName: "Muhammad Hamza Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hamza | Full Stack JavaScript Developer",
    description: "Premium personal portfolio of Muhammad Hamza, showcasing scalable web applications built with Next.js, React, Node.js, and modern databases.",
    creator: "@mhamza",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${geist.variable}`}
    >
      <body className="antialiased selection:bg-primary selection:text-foreground flex flex-col min-h-screen">
        <Providers>
          {!isAdmin && <CustomCursor />}
          {!isAdmin && <Navbar />}
          <main className="flex-grow">{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <CommandPalette />}
          {!isAdmin && <ChatWidget />}
          {!isAdmin && <AiChatButton />}
        </Providers>
      </body>
    </html>
  );
}

