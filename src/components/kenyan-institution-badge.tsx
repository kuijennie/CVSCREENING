"use client";

import { getTierColor, getTierLabel, type InstitutionTier } from "@/lib/kenyan-institutions";
import { cn } from "@/lib/utils";

export function KenyanInstitutionBadge({
  tier,
  institution,
  className,
}: {
  tier: InstitutionTier;
  institution: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        getTierColor(tier),
        className
      )}
      title={`${institution} - ${getTierLabel(tier)}`}
    >
      {getTierLabel(tier)}
    </span>
  );
}
