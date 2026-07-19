import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </div>
  );
}
