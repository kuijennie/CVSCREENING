import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
 
export const create = mutation({
  args: {
    name: v.string(),
    industry: v.optional(v.string()),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    // Prevent duplicate orgs for the same user
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .first();
 
    if (existing) return existing._id;
 
    return await ctx.db.insert("organizations", {
      name: args.name,
      industry: args.industry,
      ownerId: args.ownerId,
      createdAt: Date.now(),
    });
  },
});
 
export const getByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    if (!args.ownerId) return null;
    return await ctx.db
      .query("organizations")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .first();
  },
});
 
export const update = mutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("organizations").order("desc").collect();
  },
});

export const toggleAnonymization = mutation({
  args: { id: v.id("organizations"), enabled: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { anonymizationEnabled: args.enabled });
  },
});

export const toggleSuspend = mutation({
  args: { id: v.id("organizations"), suspended: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { suspended: args.suspended });
  },
});