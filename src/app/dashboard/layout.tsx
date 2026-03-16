"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { Buildings } from "@phosphor-icons/react";

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">

            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                color: "var(--primary)",
              }}
            >
              <Buildings className="h-3 w-3" weight="duotone" />
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