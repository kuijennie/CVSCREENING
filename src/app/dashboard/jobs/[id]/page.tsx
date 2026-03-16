"use client";

import { Fragment } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ScoreBadge } from "@/components/score-badge";
import { KenyanInstitutionBadge } from "@/components/kenyan-institution-badge";
import type { InstitutionTier } from "@/lib/kenyan-institutions";
import {
  ArrowLeft,
  DownloadSimple,
  Users,
  ChartBar,
  TrendUp,
  TrendDown,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as Id<"jobs">;

  const job = useQuery(api.jobs.get, { id: jobId });
  const rankings = useQuery(api.rankings.getByJob, { jobId });
  const stats = useQuery(api.rankings.getStats, { jobId });

  const [sortBy, setSortBy] = useState<string>("overallScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [minScore, setMinScore] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredRankings = (rankings || [])
    .filter((r) => r.overallScore >= minScore)
    .sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy] as number;
      const bVal = (b as Record<string, unknown>)[sortBy] as number;
      return sortDir === "desc" ? (bVal || 0) - (aVal || 0) : (aVal || 0) - (bVal || 0);
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const exportCSV = () => {
    if (!filteredRankings.length) return;
    const headers = [
      "Rank",
      "Name",
      "Overall Score",
      "Skills",
      "Experience",
      "Education",
      "Summary",
      "Strengths",
      "Weaknesses",
    ];
    const rows = filteredRankings.map((r, i) => [
      i + 1,
      r.candidate?.name || "Unknown",
      r.overallScore,
      r.skillMatch,
      r.experienceMatch,
      r.educationMatch,
      `"${r.aiSummary.replace(/"/g, '""')}"`,
      `"${r.strengths.join("; ")}"`,
      `"${r.weaknesses.join("; ")}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job.title.replace(/\s+/g, "_")}_rankings.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortBy === field ? (
      sortDir === "desc" ? (
        <CaretDown className="h-3 w-3" />
      ) : (
        <CaretUp className="h-3 w-3" />
      )
    ) : null;

  const chartData = stats?.distribution || [];
  const maxDistributionCount = Math.max(
    1,
    ...(stats?.distribution?.map((item) => item.count) || [1])
  );
  const barColor = (label: number) => {
    if (label > 80) return "#0f766e";
    if (label > 60) return "#14b8a6";
    if (label > 40) return "#5eead4";
    return "#99f6e4";
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/jobs"
          className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            {job.requirements.skills.join(", ")}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] text-sm font-medium"
        >
          <DownloadSimple className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
              <Users className="h-4 w-4" /> Candidates
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
              <ChartBar className="h-4 w-4" /> Avg Score
            </div>
            <p className="text-2xl font-bold">{Math.round(stats.avgScore)}%</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
              <TrendUp className="h-4 w-4" /> Top Score
            </div>
            <p className="text-2xl font-bold">{Math.round(stats.topScore)}%</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
              <TrendDown className="h-4 w-4" /> Low Score
            </div>
            <p className="text-2xl font-bold">{Math.round(stats.lowScore)}%</p>
          </div>
        </div>
      )}

      {/* Score Distribution Chart */}
      {stats && stats.distribution && stats.total > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
          <h3 className="font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 12, bottom: 44 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                type="category"
                fontSize={12}
                tickMargin={8}
                label={{ value: "Score", position: "bottom", offset: 12 }}
              />
              <YAxis
                fontSize={12}
                allowDecimals={false}
                ticks={Array.from({ length: maxDistributionCount + 1 }, (_, i) => i)}
                domain={[0, maxDistributionCount]}
                label={{ value: "Candidates", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value) => [value ?? 0, "Candidates"]}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => String(d.label) === String(label));
                  return `Score range: ${item?.range ?? label}`;
                }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={barColor(item.label)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--muted-foreground)]">Min Score:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm font-medium w-10">{minScore}%</span>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">
          {filteredRankings.length} candidates
        </span>
      </div>

      {/* Rankings Table */}
      {!rankings || rankings.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <ChartBar className="h-16 w-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
          <h3 className="text-lg font-medium mb-2">No rankings yet</h3>
          <p className="text-[var(--muted-foreground)]">
            Upload CVs and run analysis to see candidate rankings.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                  <th className="text-left p-3 text-sm font-medium">#</th>
                  <th className="text-left p-3 text-sm font-medium">Candidate</th>
                  <th
                    className="text-left p-3 text-sm font-medium cursor-pointer hover:text-[var(--primary)]"
                    onClick={() => handleSort("overallScore")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Overall <SortIcon field="overallScore" />
                    </span>
                  </th>
                  <th
                    className="text-left p-3 text-sm font-medium cursor-pointer hover:text-[var(--primary)]"
                    onClick={() => handleSort("skillMatch")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Skills <SortIcon field="skillMatch" />
                    </span>
                  </th>
                  <th
                    className="text-left p-3 text-sm font-medium cursor-pointer hover:text-[var(--primary)]"
                    onClick={() => handleSort("experienceMatch")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Experience <SortIcon field="experienceMatch" />
                    </span>
                  </th>
                  <th
                    className="text-left p-3 text-sm font-medium cursor-pointer hover:text-[var(--primary)]"
                    onClick={() => handleSort("educationMatch")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Education <SortIcon field="educationMatch" />
                    </span>
                  </th>
                  <th className="text-left p-3 text-sm font-medium">Institution</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((ranking, index) => (
                  <Fragment key={ranking._id}>
                    <tr
                      className="border-b border-[var(--border)] hover:bg-[var(--accent)] cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === ranking._id ? null : ranking._id)
                      }
                    >
                      <td className="p-3 text-sm text-[var(--muted-foreground)]">
                        {index + 1}
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-sm">
                          {ranking.candidate?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {ranking.candidate?.email || ""}
                        </p>
                      </td>
                      <td className="p-3">
                        <ScoreBadge score={ranking.overallScore} />
                      </td>
                      <td className="p-3">
                        <ScoreBadge score={ranking.skillMatch} size="sm" />
                      </td>
                      <td className="p-3">
                        <ScoreBadge score={ranking.experienceMatch} size="sm" />
                      </td>
                      <td className="p-3">
                        <ScoreBadge score={ranking.educationMatch} size="sm" />
                      </td>
                      <td className="p-3">
                        {ranking.candidate?.education
                          ?.filter((e) => e.isKenyan && e.institutionTier)
                          .map((e, i) => (
                            <KenyanInstitutionBadge
                              key={i}
                              tier={e.institutionTier as InstitutionTier}
                              institution={e.institution}
                            />
                          ))}
                      </td>
                    </tr>
                    {expandedId === ranking._id && (
                      <tr className="bg-[var(--secondary)]">
                        <td colSpan={7} className="p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-2">AI Summary</h4>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                {ranking.aiSummary}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-[var(--primary)]">
                                Strengths
                              </h4>
                              <ul className="text-sm space-y-1">
                                {ranking.strengths.map((s, i) => (
                                  <li key={i} className="text-[var(--muted-foreground)]">
                                    + {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-red-500">
                                Weaknesses
                              </h4>
                              <ul className="text-sm space-y-1">
                                {ranking.weaknesses.map((w, i) => (
                                  <li key={i} className="text-[var(--muted-foreground)]">
                                    - {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {ranking.kenyanInstitutionBonus ? (
                            <p className="text-xs text-[var(--primary)] mt-2">
                              +{ranking.kenyanInstitutionBonus} Kenyan institution bonus
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
