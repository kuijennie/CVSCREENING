import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  jobs: defineTable({
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
    status: v.string(),
    totalCandidates: v.optional(v.number()),
    analyzedCandidates: v.optional(v.number()),
  }).index("by_org", ["organizationId"]),

  candidates: defineTable({
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
  })
    .index("by_org", ["organizationId"])
    .searchIndex("search_name", { searchField: "name" }),

  rankings: defineTable({
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
  })
    .index("by_job", ["jobId"])
    .index("by_job_score", ["jobId", "overallScore"])
    .index("by_candidate", ["candidateId"]),

  uploadBatches: defineTable({
    jobId: v.optional(v.id("jobs")),
    totalFiles: v.number(),
    processedFiles: v.number(),
    failedFiles: v.number(),
    status: v.string(),
    organizationId: v.string(),
    createdBy: v.string(),
  }).index("by_org", ["organizationId"]),

  // Organizational schema
  organizations: defineTable({
  name: v.string(),
  ownerId: v.string(),
  industry: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_owner", ["ownerId"]),
});
