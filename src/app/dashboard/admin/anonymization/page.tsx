"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { EyeSlash, Eye, Buildings } from "@phosphor-icons/react";
import { useState } from "react";

export default function AnonymizationPage() {
  const orgs = useQuery(api.organizations.listAll);
  const toggleAnonymization = useMutation(api.organizations.toggleAnonymization);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(id: Id<"organizations">, current: boolean) {
    setLoading(id);
    try {
      await toggleAnonymization({ id, enabled: !current });
    } finally {
      setLoading(null);
    }
  }

  const enabledCount = orgs?.filter((o) => o.anonymizationEnabled).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Anonymization Settings</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Control CV anonymization per organization. When enabled, candidate names, gender,
          and age are hidden during screening to reduce bias.
        </p>
      </div>

      {orgs !== undefined && (
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <EyeSlash className="h-4 w-4" />
          {enabledCount} of {orgs.length} organization{orgs.length !== 1 ? "s" : ""} have anonymization enabled.
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--accent)]/40">
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Organization</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Industry</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Anonymization</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)]">Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {orgs === undefined &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-[var(--accent)] animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            {orgs?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  <Buildings className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  No organizations yet.
                </td>
              </tr>
            )}
            {orgs?.map((org) => {
              const enabled = !!org.anonymizationEnabled;
              return (
                <tr key={org._id} className="hover:bg-[var(--accent)]/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{org.name}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">{org.industry || "—"}</td>
                  <td className="px-4 py-3">
                    {enabled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                        <EyeSlash className="h-3 w-3" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--muted-foreground)]">
                        <Eye className="h-3 w-3" /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={loading === org._id}
                      onClick={() => handleToggle(org._id, enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                        enabled ? "bg-[var(--primary)]" : "bg-[var(--accent)]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted-foreground)]">
        <p className="font-medium text-[var(--foreground)] mb-1">What does anonymization hide?</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Candidate full name → replaced with &quot;Candidate #N&quot;</li>
          <li>Gender and age information</li>
          <li>Date of birth</li>
        </ul>
        <p className="mt-2">Skills, education, experience, and AI scores remain visible.</p>
      </div>
    </div>
  );
}
