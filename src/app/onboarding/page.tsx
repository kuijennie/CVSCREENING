"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, ArrowRight, Buildings, CheckCircle } from "@phosphor-icons/react";

const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "NGO & Non-profit",
  "Government & Public Sector",
  "Education",
  "Manufacturing",
  "Retail & FMCG",
  "Legal",
  "Consulting",
  "Construction & Engineering",
  "Media & Marketing",
  "Other",
];

const SIZES = [
  { value: "1-10", label: "1 – 10 employees" },
  { value: "11-50", label: "11 – 50 employees" },
  { value: "51-200", label: "51 – 200 employees" },
  { value: "201-500", label: "201 – 500 employees" },
  { value: "500+", label: "500+ employees" },
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const org = useQuery(
    api.organizations.getByOwner,
    isLoaded && user?.id ? { ownerId: user.id } : "skip"
  );
  const createOrg = useMutation(api.organizations.create);

  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (org) router.replace("/dashboard");
  }, [org, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !user?.id) return;

    setSubmitting(true);
    setError("");

    try {
      await createOrg({
        name: orgName.trim(),
        industry: industry || undefined,
        ownerId: user.id,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // Still loading
  if (!isLoaded || org === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"
          />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ob-display { font-family: 'Syne', sans-serif; }
        .ob-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes ob-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-card   { animation: ob-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .ob-logo   { animation: ob-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .ob-title  { animation: ob-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .ob-fields { animation: ob-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

        .ob-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .ob-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
        }
        .ob-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }

        .ob-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .ob-size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }
        .ob-size-btn {
          padding: 8px 10px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--background);
          color: var(--muted-foreground);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
        }
        .ob-size-btn:hover {
          border-color: var(--primary);
          color: var(--foreground);
        }
        .ob-size-btn.selected {
          border-color: var(--primary);
          background: color-mix(in srgb, var(--primary) 8%, transparent);
          color: var(--primary);
          font-weight: 500;
        }

        .ob-submit {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ob-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .ob-submit:active:not(:disabled) { transform: translateY(0); }
        .ob-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .ob-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .ob-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--muted-foreground);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
      `}</style>

      {/* Background glow orbs */}
      <div
        className="ob-glow"
        style={{
          width: 400, height: 400,
          background: "color-mix(in srgb, var(--primary) 8%, transparent)",
          top: "-80px", right: "-80px",
        }}
      />
      <div
        className="ob-glow"
        style={{
          width: 280, height: 280,
          background: "color-mix(in srgb, var(--primary) 5%, transparent)",
          bottom: "40px", left: "-60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo mark */}
        <div className="ob-logo flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <Users className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} weight="bold" />
          </div>
          <span className="ob-display text-xl font-bold" style={{ letterSpacing: "-0.02em" }}>
            CVScreen<span style={{ color: "var(--primary)" }}>.</span>AI
          </span>
        </div>

        {/* Card */}
        <div
          className="ob-card rounded-2xl p-8"
          style={{
            border: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          {/* Heading */}
          <div className="ob-title mb-7">
            <div className="flex items-center gap-2 mb-3">
              <Buildings className="h-5 w-5" style={{ color: "var(--primary)" }} weight="duotone" />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--primary)", fontFamily: "'DM Sans', sans-serif" }}
              >
                One-time setup
              </span>
            </div>
            <h1
              className="ob-display text-2xl font-bold mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Set up your organization
            </h1>
            <p
              className="ob-body text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)", fontWeight: 300 }}
            >
              Welcome, {user?.firstName || "there"}! Tell us a little about your
              organization to personalise your CVScreen AI workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="ob-fields space-y-5">

            {/* Org name */}
            <div>
              <label className="ob-label">Organization Name *</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="ob-input"
                placeholder="e.g. Nairobi Java House, County Government of Kisumu"
                required
                autoFocus
              />
            </div>

            {/* Industry */}
            <div>
              <label className="ob-label">Industry <span style={{ color: "var(--muted-foreground)", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="ob-input ob-select"
              >
                <option value="">Select your industry...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <p
                className="ob-body text-sm px-3 py-2 rounded-lg"
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !orgName.trim()}
              className="ob-submit"
            >
              {submitting ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  />
                  Setting up...
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p
          className="ob-body text-center text-xs mt-5"
          style={{ color: "var(--muted-foreground)", fontWeight: 300 }}
        >
          You can update these details later in Settings.
        </p>
      </div>
    </div>
  );
}