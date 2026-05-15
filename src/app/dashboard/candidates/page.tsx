"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Users,
  MagnifyingGlass,
  Trash,
  GraduationCap,
  Briefcase,
  Envelope,
  Phone,
  CaretDown,
  CaretUp,
  Briefcase as JobIcon,
} from "@phosphor-icons/react";
import { KenyanInstitutionBadge } from "@/components/kenyan-institution-badge";
import { ScoreBadge } from "@/components/score-badge";
import type { InstitutionTier } from "@/lib/kenyan-institutions";
import { Id } from "../../../../convex/_generated/dataModel";

export default function CandidatesPage() {
  const { user } = useUser();
  const orgId = user?.id || "";

  const jobs = useQuery(api.jobs.list, orgId ? { organizationId: orgId } : "skip");
  const allCandidates = useQuery(
    api.candidates.listWithScores,
    orgId ? { organizationId: orgId } : "skip"
  );
  const [filterJobId, setFilterJobId] = useState<string>("all");
  const jobRankings = useQuery(
    api.rankings.getByJob,
    filterJobId !== "all" ? { jobId: filterJobId as Id<"jobs"> } : "skip"
  );
  const deleteCandidate = useMutation(api.candidates.remove);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const candidateList = filterJobId !== "all"
    ? (jobRankings || [])
        .filter((r) => r.candidate)
        .map((r) => ({
          ...(r.candidate!),
          bestScore: r.overallScore,
          bestRanking: r,
        }))
    : (allCandidates || []);

  const filtered = candidateList.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.education.some((e) =>
        e.institution.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTier =
      filterTier === "all" ||
      c.education.some((e) => e.institutionTier === filterTier);

    return matchesSearch && matchesTier;
  });

  const selectedJob = jobs?.find((j) => j._id === filterJobId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {selectedJob
            ? `Ranked candidates for: ${selectedJob.title}`
            : "All uploaded candidate profiles across all jobs."}
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, skill, or institution..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <select
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="all">All Jobs</option>
            {jobs?.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="all">All Institutions</option>
            <option value="top">Top Tier Universities</option>
            <option value="mid">Mid Tier Universities</option>
            <option value="tvet">TVET Institutions</option>
            <option value="professional">Professional Bodies</option>
          </select>
        </div>
      </div>

      {filterJobId !== "all" && filtered.length > 0 && (
        <div className="flex gap-2 mb-4 text-xs text-[var(--muted-foreground)] items-center">
          <JobIcon className="h-3.5 w-3.5" />
          <span>Showing scores for <strong className="text-[var(--foreground)]">{selectedJob?.title}</strong> - ranked highest to lowest</span>
        </div>
      )}

      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
          <h3 className="text-lg font-medium mb-2">
            {filterJobId !== "all"
              ? "No candidates screened for this job yet"
              : (allCandidates?.length ? "No matches found" : "No candidates yet")}
          </h3>
          <p className="text-[var(--muted-foreground)]">
            {filterJobId !== "all"
              ? "Upload CVs and select this job to screen candidates."
              : (allCandidates?.length ? "Try adjusting your search or filters." : "Upload CVs to add candidates.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((candidate, index) => {
            const ranking = candidate.bestRanking;

            return (
              <div
                key={candidate._id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                <div
                  className="flex items-start justify-between p-4 cursor-pointer hover:bg-[var(--accent)] transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === candidate._id ? null : candidate._id)
                  }
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--secondary)] flex items-center justify-center text-xs font-bold text-[var(--muted-foreground)] mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{candidate.name}</h3>
                        {candidate.bestScore !== null ? (
                          <ScoreBadge score={candidate.bestScore} size="sm" />
                        ) : (
                          <span className="text-xs text-[var(--muted-foreground)] italic">Not analyzed</span>
                        )}
                        {candidate.education
                          .filter((e) => e.isKenyan && e.institutionTier)
                          .map((e, i) => (
                            <KenyanInstitutionBadge
                              key={i}
                              tier={e.institutionTier as InstitutionTier}
                              institution={e.institution}
                            />
                          ))}
                      </div>

                      {filterJobId !== "all" && ranking && (
                        <div className="flex gap-3 mb-2">
                          <span className="text-xs text-[var(--muted-foreground)]">
                            Skills <strong className="text-[var(--foreground)]">{ranking.skillMatch}%</strong>
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            Experience <strong className="text-[var(--foreground)]">{ranking.experienceMatch}%</strong>
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            Education <strong className="text-[var(--foreground)]">{ranking.educationMatch}%</strong>
                          </span>
                        </div>
                      )}

                      {candidate.summary && (
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-1 mb-2">
                          {candidate.summary}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 6).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs text-[var(--muted-foreground)]"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 6 && (
                          <span className="px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
                            +{candidate.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this candidate?")) {
                          deleteCandidate({ id: candidate._id });
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    {expandedId === candidate._id ? (
                      <CaretUp className="h-4 w-4 text-[var(--muted-foreground)]" />
                    ) : (
                      <CaretDown className="h-4 w-4 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </div>

                {expandedId === candidate._id && (
                  <div className="border-t border-[var(--border)] bg-[var(--secondary)] p-4">
                    {filterJobId !== "all" && ranking?.aiSummary && (
                      <div className="mb-4 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <h4 className="text-sm font-semibold mb-1">AI Analysis</h4>
                        <p className="text-sm text-[var(--muted-foreground)]">{ranking.aiSummary}</p>
                        {ranking.strengths?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {ranking.strengths.map((s, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                + {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {ranking.weaknesses?.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {ranking.weaknesses.map((w, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                - {w}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Contact</h4>
                        {candidate.email && (
                          <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                            <Envelope className="h-3 w-3" /> {candidate.email}
                          </p>
                        )}
                        {candidate.phone && (
                          <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {candidate.phone}
                          </p>
                        )}
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          File: {candidate.fileName}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" /> Education
                        </h4>
                        {candidate.education.map((edu, i) => (
                          <div key={i} className="mb-2">
                            <p className="text-sm font-medium">{edu.institution}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {edu.degree}
                              {edu.field ? ` in ${edu.field}` : ""}
                              {edu.year ? ` (${edu.year})` : ""}
                            </p>
                            {edu.isKenyan && edu.institutionTier && (
                              <KenyanInstitutionBadge
                                tier={edu.institutionTier as InstitutionTier}
                                institution={edu.institution}
                                className="mt-1"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <Briefcase className="h-4 w-4" /> Experience
                        </h4>
                        {candidate.experience.map((exp, i) => (
                          <div key={i} className="mb-2">
                            <p className="text-sm font-medium">
                              {exp.role} at {exp.company}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {exp.duration || "Duration unknown"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {candidate.certifications.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-1">Certifications</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.certifications.map((cert, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
