"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Buildings, Briefcase, Users, ChartBar, ShieldCheck, EyeSlash } from "@phosphor-icons/react";

export default function AdminOverviewPage() {
  const stats = useQuery(api.admin.platformStats);

  const cards = [
    { title: "Total Organizations", value: stats?.totalOrganizations, icon: <Buildings className="h-5 w-5" />, },
    { title: "Active Organizations", value: stats?.activeOrganizations, icon: <ShieldCheck className="h-5 w-5" />, },
    { title: "Total Jobs", value: stats?.totalJobs, icon: <Briefcase className="h-5 w-5" />, },
    { title: "Total Candidates", value: stats?.totalCandidates, icon: <Users className="h-5 w-5" />, },
    { title: "Total Rankings", value: stats?.totalRankings, icon: <ChartBar className="h-5 w-5" />, },
    { title: "Anonymization On", value: stats?.anonymizationEnabledCount, icon: <EyeSlash className="h-5 w-5" />, },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Platform Overview</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Real-time stats across all organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--muted-foreground)]">{card.title}</span>
              <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                {card.icon}
              </div>
            </div>
            {stats === undefined ? (
              <div className="h-8 w-16 rounded bg-[var(--accent)] animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">{card.value ?? 0}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
