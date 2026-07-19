"use client";

import Link from "next/link";
import { RefreshCw, Download, Mail } from "lucide-react";

export default function QuickActions() {
  const handleSync = () => {
    window.location.reload();
  };

  const handleExport = () => {
    alert("CSV Export compilation starting...");
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-semibold rounded-xl bg-muted/50 hover:bg-muted text-foreground transition cursor-none text-left border border-border"
      >
        <RefreshCw className="w-4 h-4 text-muted-foreground" />
        <span>Sync Database</span>
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-semibold rounded-xl bg-muted/50 hover:bg-muted text-foreground transition cursor-none text-left border border-border"
      >
        <Download className="w-4 h-4 text-muted-foreground" />
        <span>Export Queries (CSV)</span>
      </button>

      <Link
        href="/admin/contacts"
        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-semibold rounded-xl bg-muted/50 text-foreground opacity-50 cursor-not-allowed pointer-events-none text-left border border-border"
      >
        <Mail className="w-4 h-4 text-muted-foreground" />
        <span>Send Inbound Reply</span>
      </Link>
    </div>
  );
}
