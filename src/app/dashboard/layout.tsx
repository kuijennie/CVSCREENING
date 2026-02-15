"use client";

import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
          <div className="flex items-center justify-end h-14 px-4 sm:px-6 gap-3">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
