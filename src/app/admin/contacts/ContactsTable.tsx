"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Search,
  Loader2,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ContactsTableProps {
  initialContacts: Contact[];
}

export default function ContactsTable({ initialContacts }: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);

    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: result.data.status } : c))
        );
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch {
      alert("Network error. Could not sync status with database.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const processedContacts = contacts
    .filter((contact) => {
      const matchesStatus = statusFilter === "All" || contact.status === statusFilter;
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const statuses = ["All", "Pending", "Done", "Completed", "Resolved"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-xl border border-border w-full sm:w-auto">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-none ${
                statusFilter === status
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/50 transition font-sans"
          />
        </div>
      </div>

      <div className="premium-panel rounded-2xl overflow-hidden border border-border/80 bg-card/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-10"></th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Sender
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Subject & Details
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Status
                </th>
                <th
                  onClick={toggleSortOrder}
                  className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {processedContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-muted-foreground font-sans">
                    No contact records match your current criteria.
                  </td>
                </tr>
              ) : (
                processedContacts.map((contact) => {
                  const isExpanded = !!expandedRows[contact.id];
                  const isUpdating = updatingId === contact.id;

                  return (
                    <>
                      <tr
                        key={contact.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          isExpanded ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="pl-4">
                          <button
                            onClick={() => toggleRow(contact.id)}
                            className="p-1.5 border border-border hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition cursor-none"
                            aria-label={isExpanded ? "Collapse row" : "Expand row"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                              {contact.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-sans">
                              <Mail className="w-3.5 h-3.5" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-sans">
                                <Phone className="w-3.5 h-3.5" />
                                {contact.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-sans">
                          <div className="flex flex-col max-w-xs">
                            <span className="font-semibold text-foreground truncate">
                              {contact.subject}
                            </span>
                            <span className="text-muted-foreground truncate mt-1">
                              {contact.message}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="relative inline-flex items-center">
                            {isUpdating ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground bg-muted/50 border border-border rounded-xl">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <select
                                value={contact.status}
                                onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                                className={`px-3 py-1.5 text-[10px] uppercase font-semibold border rounded-xl bg-background outline-none transition cursor-none ${
                                  contact.status === "Pending"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                                    : contact.status === "Done"
                                    ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/25"
                                    : contact.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                                    : "bg-cyan-500/10 text-cyan-500 border-cyan-500/25"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Done">Done</option>
                                <option value="Completed">Completed</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[10px] text-muted-foreground font-sans">
                          {new Date(contact.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRow(contact.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-none uppercase tracking-wider font-sans"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${contact.id}-details`} className="bg-muted/10">
                          <td colSpan={6} className="px-6 py-8 border-b border-border/60">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="md:col-span-1 space-y-4">
                                <div className="p-4 border border-border bg-card rounded-xl space-y-3 font-sans shadow-sm">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border/50 pb-2">
                                    Metadata Summary
                                  </span>

                                  {contact.company && (
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                      <Building2 className="w-4 h-4 text-muted-foreground" />
                                      <span>{contact.company}</span>
                                    </div>
                                  )}

                                  {contact.service && (
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                                      <span>{contact.service}</span>
                                    </div>
                                  )}

                                  {contact.budget && (
                                    <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                                      <span className="text-[9px] uppercase font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded-md bg-muted">
                                        Budget
                                      </span>
                                      <span>{contact.budget}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 text-xs text-foreground">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                      {new Date(contact.createdAt).toLocaleString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStatusChange(contact.id, "Resolved")}
                                    disabled={contact.status === "Resolved" || isUpdating}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border bg-background hover:bg-muted text-[10px] uppercase font-bold tracking-wider rounded-xl transition cursor-none disabled:opacity-40"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Resolve</span>
                                  </button>
                                  <a
                                    href={`mailto:${contact.email}?subject=RE: ${encodeURIComponent(
                                      contact.subject
                                    )}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border bg-background hover:bg-muted text-[10px] uppercase font-bold tracking-wider rounded-xl transition cursor-none text-foreground text-center"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                    <span>Email</span>
                                  </a>
                                </div>
                              </div>

                              <div className="md:col-span-2 space-y-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block font-sans">
                                  Detailed Inquiry Message
                                </span>
                                <p className="text-sm leading-relaxed text-foreground bg-card p-5 border border-border rounded-xl whitespace-pre-wrap font-sans shadow-sm">
                                  {contact.message}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
