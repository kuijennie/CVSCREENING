"use client";

import { getTierColor, getTierLabel, type InstitutionTier } from "@/lib/kenyan-institutions";
import { GraduationCap } from "@phosphor-icons/react";
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
      <GraduationCap className="h-3 w-3" />
      {getTierLabel(tier)}
    </span>
  );
}
