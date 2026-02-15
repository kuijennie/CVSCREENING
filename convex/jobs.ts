import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    requirements: v.object({
      skills: v.array(v.string()),
      minExperience: v.number(),
      educationLevel: v.string(),
      preferredInstitutions: v.optional(v.array(v.string())),
      customRequirements: v.optional(v.string()),
    }),
    scoringWeights: v.optional(
      v.object({
        skills: v.number(),
        experience: v.number(),
        education: v.number(),
        certifications: v.number(),
      })
    ),
    organizationId: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", {
      ...args,
      status: "active",
      totalCandidates: 0,
      analyzedCandidates: 0,
    });
  },
});

export const list = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(
      v.object({
        skills: v.array(v.string()),
        minExperience: v.number(),
        educationLevel: v.string(),
        preferredInstitutions: v.optional(v.array(v.string())),
        customRequirements: v.optional(v.string()),
      })
    ),
    scoringWeights: v.optional(
      v.object({
        skills: v.number(),
        experience: v.number(),
        education: v.number(),
        certifications: v.number(),
      })
    ),
    status: v.optional(v.string()),
    totalCandidates: v.optional(v.number()),
    analyzedCandidates: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    // Delete associated rankings
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_job", (q) => q.eq("jobId", args.id))
      .collect();
    for (const ranking of rankings) {
      await ctx.db.delete(ranking._id);
    }
    await ctx.db.delete(args.id);
  },
});
