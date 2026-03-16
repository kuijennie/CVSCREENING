"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import type { Id } from "../../convex/_generated/dataModel";

interface UseOrganizationResult {
  org: {
    _id: Id<"organizations">;
    name: string;
    industry?: string;
    ownerId: string;
    createdAt: number;
  } | null | undefined;
  /** Convenience: the org's Convex _id as a string, or "" if not loaded */
  orgId: string;
  isLoading: boolean;
}

export function useOrganization(): UseOrganizationResult {
  const { user, isLoaded } = useUser();

  const org = useQuery(
    api.organizations.getByOwner,
    isLoaded && user?.id ? { ownerId: user.id } : "skip"
  );

  const isLoading = !isLoaded || org === undefined;
  const orgId = org ? org._id : "";

  return { org, orgId, isLoading };
}