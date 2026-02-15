import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    jobId: v.optional(v.id("jobs")),
    totalFiles: v.number(),
    organizationId: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("uploadBatches", {
      ...args,
      processedFiles: 0,
      failedFiles: 0,
      status: "uploading",
    });
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("uploadBatches"),
    processedFiles: v.optional(v.number()),
    failedFiles: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) filtered[k] = val;
    }
    await ctx.db.patch(id, filtered);
  },
});

export const get = query({
  args: { id: v.id("uploadBatches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listRecent = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("uploadBatches")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .take(10);
  },
});
