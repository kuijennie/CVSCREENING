"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const org = useQuery(
    api.organizations.getByOwner,
    isLoaded && user?.id ? { ownerId: user.id } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (org === undefined) return;

    if (org === null) {
      router.replace("/onboarding");
    }
  }, [isLoaded, org, router]);

  if (!isLoaded || org === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (org === null) return null;

  if (org.suspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full mx-4 rounded-xl border border-red-500/30 bg-[var(--card)] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <Buildings className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Account Suspended</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Your organization&apos;s account has been suspended by an administrator. You cannot access
            the dashboard at this time.
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Please contact support to resolve this issue.
          </p>
          <div className="pt-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">

            <div className="text-xs font-medium text-[var(--muted-foreground)]">
              {org.name}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
