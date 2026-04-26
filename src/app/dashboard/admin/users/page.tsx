"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Buildings, ProhibitInset, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function ManageUsersPage() {
  const orgs = useQuery(api.organizations.listAll);
  const toggleSuspend = useMutation(api.organizations.toggleSuspend);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggleSuspend(id: Id<"organizations">, current: boolean) {
    setLoading(id);
    try {
      await toggleSuspend({ id, suspended: !current });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Manage Users</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          View and manage all registered organizations.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--accent)]/40">
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Organization</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Industry</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Created</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Status</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {orgs === undefined &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-[var(--accent)] animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            {orgs?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  <Buildings className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  No organizations registered yet.
                </td>
              </tr>
            )}
            {orgs?.map((org) => (
              <tr key={org._id} className="hover:bg-[var(--accent)]/30 transition-colors">
                <td className="px-4 py-3 font-medium">{org.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{org.industry || "—"}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {new Date(org.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {org.suspended ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-500">
                      <ProhibitInset className="h-3 w-3" /> Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={loading === org._id}
                    onClick={() => handleToggleSuspend(org._id, !!org.suspended)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      org.suspended
                        ? "border-green-500/40 text-green-600 hover:bg-green-500/10"
                        : "border-red-500/40 text-red-500 hover:bg-red-500/10"
                    } disabled:opacity-50`}
                  >
                    {loading === org._id ? "..." : org.suspended ? "Reinstate" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
