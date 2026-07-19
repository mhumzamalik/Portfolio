import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("Checking if publication 'supabase_realtime' exists...");
    const pubCheck = await prisma.$queryRawUnsafe<any[]>(
      "SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'"
    );

    if (pubCheck.length === 0) {
      console.log("Creating publication 'supabase_realtime'...");
      await prisma.$executeRawUnsafe("CREATE PUBLICATION supabase_realtime");
    }

    console.log("Enabling realtime for Conversation and Message tables...");

    const tablesCheck = await prisma.$queryRawUnsafe<any[]>(`
      SELECT tablename 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename IN ('Conversation', 'Message')
    `);

    const existingTables = tablesCheck.map(r => r.tablename);

    if (!existingTables.includes('Conversation')) {
      await prisma.$executeRawUnsafe('ALTER PUBLICATION supabase_realtime ADD TABLE "Conversation"');
      console.log("Added Conversation table to publication.");
    }

    if (!existingTables.includes('Message')) {
      await prisma.$executeRawUnsafe('ALTER PUBLICATION supabase_realtime ADD TABLE "Message"');
      console.log("Added Message table to publication.");
    }

    console.log("Supabase Realtime setup complete!");
  } catch (error) {
    console.error("Error setting up realtime publication:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
