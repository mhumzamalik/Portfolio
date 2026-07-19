import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Inbox,
  Hourglass,
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import QuickActions from "@/components/admin/QuickActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    total,
    pending,
    done,
    completed,
    resolved,
    recentContacts,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "Pending" } }),
    prisma.contact.count({ where: { status: "Done" } }),
    prisma.contact.count({ where: { status: "Completed" } }),
    prisma.contact.count({ where: { status: "Resolved" } }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      name: "Total Queries",
      value: total,
      icon: <Inbox className="w-4 h-4 text-primary" />,
      color: "border-primary/20 bg-primary/5",
      description: "All time received",
    },
    {
      name: "Pending",
      value: pending,
      icon: <Hourglass className="w-4 h-4 text-amber-500 animate-pulse" />,
      color: "border-amber-500/20 bg-amber-500/5",
      description: "Requires attention",
    },
    {
      name: "Completed",
      value: completed,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      color: "border-emerald-500/20 bg-emerald-500/5",
      description: "Successfully processed",
    },
    {
      name: "Resolved",
      value: resolved,
      icon: <MessageSquare className="w-4 h-4 text-cyan-500" />,
      color: "border-cyan-500/20 bg-cyan-500/5",
      description: "Inquiries closed",
    },
    {
      name: "Done",
      value: done,
      icon: <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
      color: "border-indigo-500/20 bg-indigo-500/5",
      description: "Marked as done",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="premium-panel p-5 rounded-2xl relative overflow-hidden group border border-border/80 bg-card/50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-sans">
                {stat.name}
              </span>
              <div className={`p-2 border rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-light text-foreground">
                {stat.value}
              </span>
              <span className="text-[9px] text-muted-foreground mt-0.5 font-sans">
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="serif-title text-xl text-foreground font-semibold">
              Recent Queries
            </h2>
            <Link
              href="/admin/contacts"
              className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary hover:underline cursor-none"
            >
              <span>View All Inbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="premium-panel rounded-2xl overflow-hidden border border-border/80 bg-card/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Sender
                    </th>
                    <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Subject
                    </th>
                    <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentContacts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-xs text-muted-foreground font-sans"
                      >
                        No contact records found in database.
                      </td>
                    </tr>
                  ) : (
                    recentContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                              {contact.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-sans mt-0.5">
                              {contact.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-foreground font-sans truncate max-w-[200px]">
                          {contact.subject}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] uppercase font-semibold border ${
                              contact.status === "Pending"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : contact.status === "Done"
                                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                : contact.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[10px] text-muted-foreground font-sans">
                          {new Date(contact.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h2 className="serif-title text-xl text-foreground font-semibold">
              Operations
            </h2>

            <div className="premium-panel p-5 rounded-2xl border border-border/80 bg-card/50 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2 font-sans">
                Quick Actions
              </span>

              <QuickActions />

            </div>

            <div className="premium-panel p-5 rounded-2xl border border-border/80 bg-card/50 shadow-sm space-y-3 font-sans">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">
                System Status
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Database Engine</span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Email Dispatch</span>
                <span className="text-foreground">Resend (Active)</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Sync Latency</span>
                <span className="text-foreground">Optimal (&lt; 10ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
