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
} from "@phosphor-icons/react";
import { KenyanInstitutionBadge } from "@/components/kenyan-institution-badge";
import type { InstitutionTier } from "@/lib/kenyan-institutions";

export default function CandidatesPage() {
  const { user } = useUser();
  const orgId = user?.id || "";

  const candidates = useQuery(
    api.candidates.list,
    orgId ? { organizationId: orgId } : "skip"
  );
  const deleteCandidate = useMutation(api.candidates.remove);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = (candidates || []).filter((c) => {
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          All uploaded candidate profiles across all jobs.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Candidates */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
          <h3 className="text-lg font-medium mb-2">
            {candidates?.length ? "No matches found" : "No candidates yet"}
          </h3>
          <p className="text-[var(--muted-foreground)]">
            {candidates?.length
              ? "Try adjusting your search or filters."
              : "Upload CVs to add candidates."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((candidate) => (
            <div
              key={candidate._id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              <div
                className="flex items-start justify-between p-4 cursor-pointer hover:bg-[var(--accent)] transition-colors"
                onClick={() =>
                  setExpandedId(
                    expandedId === candidate._id ? null : candidate._id
                  )
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{candidate.name}</h3>
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
                  {candidate.summary && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-1 mb-2">
                      {candidate.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full bg-[var(--secondary)] text-xs"
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
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Contact */}
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

                    {/* Education */}
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

                    {/* Experience */}
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

                  {/* Certifications */}
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
          ))}
        </div>
      )}
    </div>
  );
}
