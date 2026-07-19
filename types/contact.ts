import { Contact } from "@prisma/client";

export type ContactData = Omit<Contact, "id" | "createdAt" | "updatedAt">;
export type ContactWithTimestamps = Contact;
