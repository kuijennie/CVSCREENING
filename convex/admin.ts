import { query } from "./_generated/server";

export const platformStats = query({
  args: {},
  handler: async (ctx) => {
    const [orgs, jobs, candidates, rankings] = await Promise.all([
      ctx.db.query("organizations").collect(),
      ctx.db.query("jobs").collect(),
      ctx.db.query("candidates").collect(),
      ctx.db.query("rankings").collect(),
    ]);

    return {
      totalOrganizations: orgs.length,
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      totalRankings: rankings.length,
      activeOrganizations: orgs.filter((o) => !o.suspended).length,
      anonymizationEnabledCount: orgs.filter((o) => o.anonymizationEnabled).length,
    };
  },
});
