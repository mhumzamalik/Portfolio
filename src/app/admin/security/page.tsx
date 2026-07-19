import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import SecurityPageClient from "./SecurityPageClient";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const adminUser = await prisma.adminUser.findUnique({
    where: { authUserId: user.id },
    select: {
      twoFactorEnabled: true,
      twoFactorVerifiedAt: true,
    },
  });

  const isEnabled = adminUser?.twoFactorEnabled ?? false;
  const verifiedAt = adminUser?.twoFactorVerifiedAt?.toISOString() ?? null;

  return (
    <SecurityPageClient isEnabled={isEnabled} verifiedAt={verifiedAt} />
  );
}
