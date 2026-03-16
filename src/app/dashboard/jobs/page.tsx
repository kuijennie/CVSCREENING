"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Plus, Briefcase, Trash, Eye, ToggleLeft, ToggleRight, PencilSimple, X, Check } from "@phosphor-icons/react";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EditState {
  id: Id<"jobs">;
  title: string;
  description: string;
  skills: string;
  educationLevel: string;
  customRequirements: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const { user } = useUser();
  const orgId = user?.id || "";
  const jobs = useQuery(api.jobs.list, orgId ? { organizationId: orgId } : "skip");
  const createJob = useMutation(api.jobs.create);
  const deleteJob = useMutation(api.jobs.remove);
  const updateJob = useMutation(api.jobs.update);

  // ── Create form state ──
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [educationLevel, setEducationLevel] = useState("bachelor");
  const [customRequirements, setCustomRequirements] = useState("");

  // ── Edit state ──
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Handlers: Create ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !orgId) return;

    await createJob({
      title,
      description,
      requirements: {
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        minExperience: 0,
        educationLevel,
        customRequirements: customRequirements || undefined,
      },
      organizationId: orgId,
      createdBy: user?.id || "",
    });

    setTitle("");
    setDescription("");
    setSkills("");
    setCustomRequirements("");
    setShowForm(false);
  };

  // ── Handlers: Edit ──
  const openEdit = (job: NonNullable<typeof jobs>[number]) => {
    setEditState({
      id: job._id,
      title: job.title,
      description: job.description || "",
      skills: (job.requirements?.skills || []).join(", "),
      educationLevel: job.requirements?.educationLevel || "bachelor",
      customRequirements: job.requirements?.customRequirements || "",
    });
    // close create form if open
    setShowForm(false);
  };

  const cancelEdit = () => setEditState(null);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState) return;
    setSaving(true);
    try {
      await updateJob({
        id: editState.id,
        title: editState.title,
        description: editState.description,
        requirements: {
          skills: editState.skills.split(",").map((s) => s.trim()).filter(Boolean),
          minExperience: 0,
          educationLevel: editState.educationLevel,
          customRequirements: editState.customRequirements || undefined,
        },
      });
      setEditState(null);
    } finally {
      setSaving(false);
    }
  };

  // ── Shared form field styles ──
  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm";

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage job postings and requirements for CV screening.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditState(null); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Job
        </button>
      </div>

      {/* ── Create Job Form ── */}
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
                className={inputCls}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputCls} min-h-[100px]`}
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
                className={inputCls}
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className={inputCls}
              >
                <option value="any">Any</option>
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Requirements (optional)
              </label>
              <textarea
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                className={inputCls}
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

      {/* ── Jobs List ── */}
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
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* ── Normal view ── */}
              {editState?.id !== job._id ? (
                <div className="p-4">
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

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-4">
                      <div className="text-right mr-2">
                        <p className="text-sm font-medium">
                          {job.analyzedCandidates || 0}/{job.totalCandidates || 0}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">screened</p>
                      </div>

                      {/* Toggle active/inactive */}
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

                      {/* Edit */}
                      <button
                        onClick={() => openEdit(job)}
                        className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                        title="Edit job"
                      >
                        <PencilSimple className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </button>

                      {/* View rankings */}
                      <Link
                        href={`/dashboard/jobs/${job._id}`}
                        className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                        title="View rankings"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {/* Delete */}
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
              ) : (
                /* ── Inline Edit Form ── */
                <div
                  className="p-5"
                  style={{ borderTop: "3px solid var(--primary)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PencilSimple className="h-4 w-4 text-[var(--primary)]" />
                      <h3 className="font-semibold text-sm">Editing: {job.title}</h3>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-lg hover:bg-[var(--accent)] transition-colors"
                      title="Cancel edit"
                    >
                      <X className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-[var(--muted-foreground)] uppercase tracking-wide">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={editState.title}
                          onChange={(e) =>
                            setEditState({ ...editState, title: e.target.value })
                          }
                          className={inputCls}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-[var(--muted-foreground)] uppercase tracking-wide">
                          Education Level
                        </label>
                        <select
                          value={editState.educationLevel}
                          onChange={(e) =>
                            setEditState({ ...editState, educationLevel: e.target.value })
                          }
                          className={inputCls}
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
                      <label className="block text-xs font-medium mb-1 text-[var(--muted-foreground)] uppercase tracking-wide">
                        Description *
                      </label>
                      <textarea
                        value={editState.description}
                        onChange={(e) =>
                          setEditState({ ...editState, description: e.target.value })
                        }
                        className={`${inputCls} min-h-[90px]`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--muted-foreground)] uppercase tracking-wide">
                        Required Skills (comma-separated) *
                      </label>
                      <input
                        type="text"
                        value={editState.skills}
                        onChange={(e) =>
                          setEditState({ ...editState, skills: e.target.value })
                        }
                        className={inputCls}
                        placeholder="e.g. React, Node.js, TypeScript"
                        required
                      />
                      {/* Live skill preview */}
                      {editState.skills && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {editState.skills
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--muted-foreground)] uppercase tracking-wide">
                        Additional Requirements (optional)
                      </label>
                      <textarea
                        value={editState.customRequirements}
                        onChange={(e) =>
                          setEditState({
                            ...editState,
                            customRequirements: e.target.value,
                          })
                        }
                        className={`${inputCls} min-h-[70px]`}
                        placeholder="Any other requirements..."
                      />
                    </div>

                    {/* Save / Cancel */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium transition-opacity"
                      >
                        <Check className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}