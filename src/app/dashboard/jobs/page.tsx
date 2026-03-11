"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Plus, Briefcase, Trash, Eye, ToggleLeft, ToggleRight } from "@phosphor-icons/react";
import Link from "next/link";
import { ScoreBadge } from "@/components/score-badge";

export default function JobsPage() {
  const { user } = useUser();
  const orgId = user?.id || "";
  const jobs = useQuery(api.jobs.list, orgId ? { organizationId: orgId } : "skip");
  const createJob = useMutation(api.jobs.create);
  const deleteJob = useMutation(api.jobs.remove);
  const updateJob = useMutation(api.jobs.update);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [educationLevel, setEducationLevel] = useState("bachelor");
  const [customRequirements, setCustomRequirements] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !orgId) return;

    await createJob({
      title,
      description,
      requirements: {
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        minExperience,
        educationLevel,
        customRequirements: customRequirements || undefined,
      },
      organizationId: orgId,
      createdBy: user?.id || "",
    });

    setTitle("");
    setDescription("");
    setSkills("");
    setMinExperience(0);
    setCustomRequirements("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage job postings and requirements for CV screening.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Job
        </button>
      </div>

      {/* Create Job Form */}
      {showForm && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] min-h-[100px]"
                placeholder="Describe the role and responsibilities..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Required Skills (comma-separated) *
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Experience (years)
                </label>
                <input
                  type="number"
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="any">Any</option>
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor&apos;s Degree</option>
                  <option value="master">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Requirements (optional)
              </label>
              <textarea
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Any other requirements..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-sm font-medium"
              >
                Create Job
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      {!jobs || jobs.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
          <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
          <p className="text-[var(--muted-foreground)] mb-4">
            Create a job posting to define requirements and start screening CVs.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Create First Job
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.status === "active"
                          ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requirements.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full bg-[var(--secondary)] text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-right mr-2">
                    <p className="text-sm font-medium">
                      {job.analyzedCandidates || 0}/{job.totalCandidates || 0}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">screened</p>
                  </div>
                  <button
                    onClick={() =>
                      updateJob({
                        id: job._id,
                        status: job.status === "active" ? "inactive" : "active",
                      })
                    }
                    className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                    title={job.status === "active" ? "Set inactive" : "Set active"}
                  >
                    {job.status === "active" ? (
                      <ToggleRight className="h-5 w-5 text-[var(--primary)]" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-[var(--muted-foreground)]" />
                    )}
                  </button>
                  <Link
                    href={`/dashboard/jobs/${job._id}`}
                    className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                    title="View rankings"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete this job and all its rankings?")) {
                        deleteJob({ id: job._id });
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors"
                    title="Delete job"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
