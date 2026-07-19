import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("❌ Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD");
  process.exit(1);
}

async function seedAdmin() {
  console.log("🔧 Starting admin seed via client auth.signUp...\n");

  const supabase = createClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: ADMIN_EMAIL! },
    });

    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
      console.log(`   Auth ID: ${existingAdmin.authUserId}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    console.log(`📧 Signing up Supabase user: ${ADMIN_EMAIL}`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Sign up completed but no user object returned.");
    }

    console.log("💾 Creating admin database record...");

    await prisma.adminUser.create({
      data: {
        authUserId: authData.user.id,
        fullName: ADMIN_NAME!,
        email: ADMIN_EMAIL!,
        role: "Admin",
      },
    });

    console.log("\n✅ Admin seed completed successfully!");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Name: ${ADMIN_NAME}`);
    console.log(`   Auth ID: ${authData.user.id}`);
    console.log(`   Role: Admin`);
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedAdmin();
