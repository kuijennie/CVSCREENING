import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    overallScore: v.number(),
    skillMatch: v.number(),
    experienceMatch: v.number(),
    educationMatch: v.number(),
    certificationMatch: v.optional(v.number()),
    aiSummary: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    kenyanInstitutionBonus: v.optional(v.number()),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if ranking already exists for this job+candidate
    const existing = await ctx.db
      .query("rankings")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("candidateId"), args.candidateId))
      .first();

    if (existing) {
      const { jobId: _j, candidateId: _c, organizationId: _o, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }
    return await ctx.db.insert("rankings", args);
  },
});

export const getByJob = query({
  args: {
    jobId: v.id("jobs"),
    sortBy: v.optional(v.string()),
    minScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let rankings = await ctx.db
      .query("rankings")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    if (args.minScore !== undefined) {
      rankings = rankings.filter((r) => r.overallScore >= args.minScore!);
    }

    // Enrich with candidate data
    const enriched = await Promise.all(
      rankings.map(async (ranking) => {
        const candidate = await ctx.db.get(ranking.candidateId);
        return { ...ranking, candidate };
      })
    );

    // Sort
    const sortField = args.sortBy || "overallScore";
    enriched.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField] as number;
      const bVal = (b as Record<string, unknown>)[sortField] as number;
      return (bVal || 0) - (aVal || 0);
    });

    return enriched;
  },
});


export const getStats = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    if (rankings.length === 0) {
      return { total: 0, avgScore: 0, topScore: 0, lowScore: 0, distribution: [] };
    }

    const scores = rankings.map((r) => r.overallScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const topScore = Math.max(...scores);
    const lowScore = Math.min(...scores);

    // Score distribution in buckets labeled by their upper bound:
    // 0-10 => 10, 11-20 => 20, ..., 91-100 => 100
    const distribution = Array.from({ length: 10 }, (_, i) => {
      const upper = (i + 1) * 10;
      const lower = i * 10;
      return {
        label: upper,
        range: `${lower + 1}–${upper}`,
        count: scores.filter((s) =>
          i === 0 ? s >= 0 && s <= upper : s > lower && s <= upper
        ).length,
      };
    });

    return { total: rankings.length, avgScore, topScore, lowScore, distribution };
  },
});
