import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let fullName = "Administrator";
  let email = user.email || "";

  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { authUserId: user.id },
    });
    if (adminUser) {
      fullName = adminUser.fullName;
      email = adminUser.email;
    }
  } catch (error) {
    console.error("[admin_layout] Profile fetch error:", error);
  }

  const userData = { fullName, email };

  return <AdminLayoutClient user={userData}>{children}</AdminLayoutClient>;
}
