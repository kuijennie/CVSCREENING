import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    summary: v.optional(v.string()),
    education: v.array(
      v.object({
        institution: v.string(),
        degree: v.string(),
        field: v.optional(v.string()),
        year: v.optional(v.string()),
        isKenyan: v.boolean(),
        institutionTier: v.optional(v.string()),
      })
    ),
    experience: v.array(
      v.object({
        company: v.string(),
        role: v.string(),
        duration: v.optional(v.string()),
        description: v.optional(v.string()),
      })
    ),
    skills: v.array(v.string()),
    certifications: v.array(v.string()),
    rawText: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileName: v.string(),
    organizationId: v.string(),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("candidates", args);
  },
});

export const list = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    const candidateIds = rankings.map((r) => r.candidateId);
    const candidates = await Promise.all(
      candidateIds.map((id) => ctx.db.get(id))
    );

    return candidates.filter(Boolean).map((candidate, i) => ({
      ...candidate,
      ranking: rankings[i],
    }));
  },
});

export const remove = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .collect();
    for (const ranking of rankings) {
      await ctx.db.delete(ranking._id);
    }
    const candidate = await ctx.db.get(args.id);
    if (candidate?.fileId) {
      await ctx.storage.delete(candidate.fileId);
    }
    await ctx.db.delete(args.id);
  },
});

export const listWithScores = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.organizationId))
      .first();
    const anonymize = org?.anonymizationEnabled ?? false;

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      candidates.map(async (candidate) => {
        const rankings = await ctx.db
          .query("rankings")
          .withIndex("by_candidate", (q) => q.eq("candidateId", candidate._id))
          .collect();

        const bestRanking = rankings.sort((a, b) => b.overallScore - a.overallScore)[0];
        return {
          ...candidate,
          bestScore: bestRanking?.overallScore ?? null,
          bestRanking: bestRanking ?? null,
        };
      })
    );

    const sorted = enriched.sort((a, b) => (b.bestScore ?? -1) - (a.bestScore ?? -1));

    if (!anonymize) return sorted;

    return sorted.map((c, i) => {
      const realName = c.name;
      const anonymizedBestRanking =
        c.bestRanking && realName
          ? {
              ...c.bestRanking,
              aiSummary: c.bestRanking.aiSummary.replace(
                new RegExp(
                  realName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                  "gi"
                ),
                "The candidate"
              ),
            }
          : c.bestRanking;

      return {
        ...c,
        name: `Candidate #${i + 1}`,
        email: undefined,
        phone: undefined,
        gender: undefined,
        age: undefined,
        dateOfBirth: undefined,
        bestRanking: anonymizedBestRanking,
      };
    });
  },
});

export const search = query({
  args: {
    organizationId: v.string(),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return await ctx.db
        .query("candidates")
        .withIndex("by_org", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .order("desc")
        .take(50);
    }
    return await ctx.db
      .query("candidates")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.searchTerm)
      )
      .take(50);
  },
});
