"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Briefcase, Users, ChartBar, TrendUp } from "@phosphor-icons/react";

export default function DashboardPage() {
  const { user } = useUser();
  const orgId = user?.id || "";

  const jobs = useQuery(api.jobs.list, orgId ? { organizationId: orgId } : "skip");
  const candidates = useQuery(
    api.candidates.list,
    orgId ? { organizationId: orgId } : "skip"
  );

  const activeJobs = jobs?.filter((j) => j.status === "active").length || 0;
  const totalCandidates = candidates?.length || 0;
  const totalAnalyzed = jobs?.reduce((sum, j) => sum + (j.analyzedCandidates || 0), 0) || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}. Here&apos;s your screening overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Jobs"
          value={activeJobs}
          icon={<Briefcase className="h-5 w-5" />}
          color="text-[var(--primary)]"
          bg="bg-[var(--primary)]/10"
        />
        <StatCard
          title="Total Candidates"
          value={totalCandidates}
          icon={<Users className="h-5 w-5" />}
          color="text-[var(--primary)]"
          bg="bg-[var(--primary)]/10"
        />
        <StatCard
          title="CVs Analyzed"
          value={totalAnalyzed}
          icon={<ChartBar className="h-5 w-5" />}
          color="text-[var(--primary)]"
          bg="bg-[var(--primary)]/10"
        />
        <StatCard
          title="Total Jobs"
          value={jobs?.length || 0}
          icon={<TrendUp className="h-5 w-5" />}
          color="text-[var(--primary)]"
          bg="bg-[var(--primary)]/10"
        />
      </div>

      {/* Recent Jobs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
        </div>
        {!jobs || jobs.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No jobs yet. Create your first job to start screening CVs.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {jobs.slice(0, 5).map((job) => (
              <a
                key={job._id}
                href={`/dashboard/jobs/${job._id}`}
                className="flex items-center justify-between p-4 hover:bg-[var(--accent)] transition-colors"
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {job.requirements.skills.slice(0, 3).join(", ")}
                    {job.requirements.skills.length > 3 && ` +${job.requirements.skills.length - 3} more`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {job.analyzedCandidates || 0}/{job.totalCandidates || 0}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">analyzed</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--muted-foreground)]">{title}</span>
        <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
