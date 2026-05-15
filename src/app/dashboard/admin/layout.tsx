"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Users, EyeSlash, SquaresFour } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Overview", href: "/dashboard/admin", icon: SquaresFour },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Anonymization", href: "/dashboard/admin/anonymization", icon: EyeSlash },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [reloaded, setReloaded] = useState(false);

  // Force-refresh Clerk session so freshly-set publicMetadata is available
  useEffect(() => {
    if (!isLoaded || !user) return;
    user.reload().finally(() => setReloaded(true));
  }, [isLoaded, user]);

  const ready = isLoaded && reloaded;
  const isAdmin = ready && (user?.publicMetadata as { isAdmin?: boolean })?.isAdmin === true;

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/dashboard");
  }, [ready, isAdmin, router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted-foreground)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-[var(--primary)]" weight="duotone" />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)] pb-0">
        {adminNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
