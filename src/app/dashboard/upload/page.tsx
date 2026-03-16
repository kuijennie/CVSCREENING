"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState, useCallback, useRef } from "react";
import { UploadSimple, FileText, CheckCircle, XCircle, CircleNotch, Warning } from "@phosphor-icons/react";
import { Id } from "../../../../convex/_generated/dataModel";

function cleanDate(value: unknown) {
  return typeof value === "string" && value.trim() && value !== "null"
    ? value.trim()
    : undefined;
}

function computeAgeFromDateOfBirth(dateOfBirth?: string) {
  if (!dateOfBirth) return undefined;

  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) return undefined;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDelta = today.getMonth() - parsed.getMonth();

  if (
    monthDelta < 0 ||
    (monthDelta === 0 && today.getDate() < parsed.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : undefined;
}

export default function UploadPage() {
  const { user } = useUser();
  const orgId = user?.id || "";

  const jobs = useQuery(api.jobs.list, orgId ? { organizationId: orgId } : "skip");
  const createCandidate = useMutation(api.candidates.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createBatch = useMutation(api.uploadBatches.create);
  const updateBatch = useMutation(api.uploadBatches.updateProgress);
  const updateJob = useMutation(api.jobs.update);
  const parseCv = useAction(api.analysis.parseCvWithAi);
  const analyzeBatch = useAction(api.analysis.analyzeBatch);

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0, failed: 0 });
  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "analyzing" | "done" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        f.name.endsWith(".pdf") ||
        f.name.endsWith(".docx")
    );
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 1000));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          f.name.endsWith(".pdf") ||
          f.name.endsWith(".docx")
      );
      setFiles((prev) => [...prev, ...selected].slice(0, 1000));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length || !selectedJobId || !orgId) return;

    setUploading(true);
    setStatus("uploading");
    setProgress({ processed: 0, total: files.length, failed: 0 });
    setErrors([]);

    const jobId = selectedJobId as Id<"jobs">;
    const batchId = await createBatch({
      jobId,
      totalFiles: files.length,
      organizationId: orgId,
      createdBy: user?.id || "",
    });

    await updateJob({
      id: jobId,
      totalCandidates: files.length,
    });

    setStatus("parsing");

    const candidateIds: Id<"candidates">[] = [];
    let failed = 0;
    const newErrors: string[] = [];

    // Process files in chunks of 3
    for (let i = 0; i < files.length; i += 3) {
      const chunk = files.slice(i, i + 3);

      const results = await Promise.allSettled(
        chunk.map(async (file) => {
          // Read file content
          const text = await readFileAsText(file);

          // Parse with AI
          const parsed = await parseCv({ rawText: text, fileName: file.name });

          // Helper to reject AI placeholder/null strings
          const clean = (val: unknown) =>
            typeof val === "string" && val.trim() && !val.startsWith("<") && val !== "null"
              ? val.trim()
              : undefined;
          const cleanNumber = (val: unknown) =>
            typeof val === "number" && Number.isFinite(val) && val > 0 ? val : undefined;

          // Upload file to Convex storage
          const uploadUrl = await generateUploadUrl({});
          const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await uploadResult.json();

          // Detect Kenyan institutions
          const { findAllKenyanInstitutions } = await import("@/lib/kenyan-institutions");
          const education = (parsed.education || [])
            .map((edu: { institution?: unknown; degree?: unknown; field?: unknown; year?: unknown }) => {
              const institution = clean(edu.institution);
              const degree = clean(edu.degree);

              if (!institution || !degree) return null;

              const matches = findAllKenyanInstitutions(institution);
              const match = matches[0];
              return {
                institution,
                degree,
                field: clean(edu.field),
                year: clean(edu.year),
                isKenyan: !!match,
                institutionTier: match?.institution.tier || undefined,
              };
            })
            .filter((edu: {
              institution: string;
              degree: string;
              field?: string;
              year?: string;
              isKenyan: boolean;
              institutionTier?: string;
            } | null): edu is {
              institution: string;
              degree: string;
              field?: string;
              year?: string;
              isKenyan: boolean;
              institutionTier?: string;
            } => Boolean(edu));

          const experience = (parsed.experience || [])
            .map((exp: { company?: unknown; role?: unknown; duration?: unknown; description?: unknown }) => {
              const company = clean(exp.company);
              const role = clean(exp.role);

              if (!company || !role) return null;

              return {
                company,
                role,
                duration: clean(exp.duration),
                description: clean(exp.description),
              };
            })
            .filter((exp: {
              company: string;
              role: string;
              duration?: string;
              description?: string;
            } | null): exp is {
              company: string;
              role: string;
              duration?: string;
              description?: string;
            } => Boolean(exp));
          const dateOfBirth = cleanDate(parsed.dateOfBirth);
          const inferredAge = computeAgeFromDateOfBirth(dateOfBirth);

          // Save candidate
          const candidateId = await createCandidate({
            name: clean(parsed.name) || file.name.replace(/\.(pdf|docx)$/i, ""),
            age: cleanNumber(parsed.age) ?? inferredAge,
            dateOfBirth,
            email: clean(parsed.email),
            phone: clean(parsed.phone),
            summary: clean(parsed.summary),
            education,
            experience,
            skills: (parsed.skills || [])
              .map((s: unknown) => clean(s))
              .filter((s: string | undefined): s is string => Boolean(s)),
            certifications: (parsed.certifications || [])
              .map((c: unknown) => clean(c))
              .filter((c: string | undefined): c is string => Boolean(c)),
            rawText: text,
            fileId: storageId,
            fileName: file.name,
            organizationId: orgId,
            uploadedBy: user?.id || "",
          });

          return candidateId;
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          candidateIds.push(result.value);
        } else {
          failed++;
          newErrors.push(result.reason?.message || "Unknown error");
        }
      }

      setProgress({ processed: candidateIds.length + failed, total: files.length, failed });
      setErrors(newErrors);
    }

    // Start AI analysis
    if (candidateIds.length > 0) {
      setStatus("analyzing");
      try {
        await analyzeBatch({
          candidateIds,
          jobId,
          organizationId: orgId,
          batchId,
        });
      } catch (err) {
        newErrors.push(`Analysis error: ${err instanceof Error ? err.message : "Unknown"}`);
        setErrors([...newErrors]);
      }
    }

    await updateBatch({
      id: batchId,
      status: failed > 0 ? "completed_with_errors" : "completed",
      processedFiles: candidateIds.length,
      failedFiles: failed,
    });

    setStatus("done");
    setUploading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload CVs</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Upload up to 1000 CVs (PDF or DOCX) for bulk screening.
        </p>
      </div>

      {/* Job Selection */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Select Job to Screen Against *</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          disabled={uploading}
        >
          <option value="">Choose a job...</option>
          {jobs?.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} ({job.requirements.skills.slice(0, 3).join(", ")})
            </option>
          ))}
        </select>
        {!jobs?.length && (
          <p className="text-sm text-amber-600 mt-2">
            <Warning className="h-3 w-3 inline mr-1" />
            Create a job first before uploading CVs.
          </p>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          uploading
            ? "border-[var(--border)] opacity-50 pointer-events-none"
            : "border-[var(--border)] hover:border-[var(--primary)] cursor-pointer"
        }`}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <UploadSimple className="h-12 w-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
        <p className="text-lg font-medium mb-1">
          Drag & drop CVs here, or click to browse
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Supports PDF and DOCX files. Up to 1000 files at once.
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </h3>
            {!uploading && (
              <div className="flex gap-2">
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear all
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedJobId}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                >
                  <UploadSimple className="h-4 w-4" />
                  Start Screening
                </button>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {status !== "idle" && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {status === "done" ? (
                    <CheckCircle className="h-5 w-5 text-[var(--primary)]" />
                  ) : status === "error" ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CircleNotch className="h-5 w-5 animate-spin text-[var(--primary)]" />
                  )}
                  <span className="text-sm font-medium">
                    {status === "uploading" && "Uploading files..."}
                    {status === "parsing" && "Parsing CVs with AI..."}
                    {status === "analyzing" && "Analyzing & ranking candidates..."}
                    {status === "done" && "Screening complete!"}
                    {status === "error" && "Error during processing"}
                  </span>
                </div>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {progress.processed}/{progress.total}
                  {progress.failed > 0 && ` (${progress.failed} failed)`}
                </span>
              </div>
              <div className="w-full h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                  style={{
                    width: `${progress.total ? (progress.processed / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
              {errors.length > 0 && (
                <div className="mt-3 text-sm text-red-500">
                  {errors.slice(0, 5).map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                  {errors.length > 5 && (
                    <p>...and {errors.length - 5} more errors</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* File list */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] max-h-80 overflow-y-auto">
            <div className="divide-y divide-[var(--border)]">
              {files.slice(0, 50).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="text-sm truncate max-w-md">{file.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {(file.size / 1024).toFixed(0)}KB
                    </span>
                  </div>
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {files.length > 50 && (
                <div className="px-4 py-2 text-sm text-[var(--muted-foreground)] text-center">
                  ...and {files.length - 50} more files
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function readFileAsText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/parse-file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.error
        ? `Could not read ${file.name}: ${payload.error}`
        : `Could not read ${file.name}.`
    );
  }

  const { text } = await response.json();
  if (text && text.trim().length > 20) return text;

  throw new Error(`Could not extract enough text from ${file.name}.`);
}
