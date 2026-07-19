import { prisma } from "@/lib/prisma";
import ContactsTable from "./ContactsTable";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedContacts = contacts.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="serif-title text-3xl md:text-4xl text-foreground tracking-tight">
          Contact Queries
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 font-sans">
          Manage, review, and resolve inbound messages and collaborations
        </p>
      </div>

      <ContactsTable initialContacts={serializedContacts} />
    </div>
  );
}
