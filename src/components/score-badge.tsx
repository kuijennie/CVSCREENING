"use client";

import { cn } from "@/lib/utils";

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 80
      ? "text-[var(--primary)]"
      : score >= 60
        ? "text-[var(--primary)]"
        : score >= 40
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-500 dark:text-red-400";

  const sizes = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-lg px-3 py-1.5 font-bold",
  };

  return (
    <span className={cn("rounded-full font-semibold", color, sizes[size])}>
      {Math.round(score)}%
    </span>
  );
}
