import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const analyzeCv = action({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.runQuery(api.candidates.get, {
      id: args.candidateId,
    });
    const job = await ctx.runQuery(api.jobs.get, { id: args.jobId });

    if (!candidate || !job) {
      throw new Error("Candidate or job not found");
    }

    const weights = job.scoringWeights || {
      skills: 40,
      experience: 0,
      education: 30,
      certifications: 10,
    };

    const prompt = `You are an expert HR analyst. Analyze this CV against the job requirements and provide a detailed scoring.

JOB REQUIREMENTS:
- Title: ${job.title}
- Description: ${job.description}
- Required Skills: ${job.requirements.skills.join(", ")}
- Education Level: ${job.requirements.educationLevel}
${job.requirements.customRequirements ? `- Additional: ${job.requirements.customRequirements}` : ""}

CANDIDATE CV TEXT:
${candidate.rawText.substring(0, 4000)}

CANDIDATE PARSED DATA:
- Name: ${candidate.name}
- Skills: ${candidate.skills.join(", ")}
- Education: ${candidate.education.map((e) => `${e.degree} from ${e.institution}`).join("; ")}
- Experience: ${candidate.experience.map((e) => `${e.role} at ${e.company} (${e.duration || "unknown"})`).join("; ")}
- Certifications: ${candidate.certifications.join(", ")}

Scoring weights: Skills(${weights.skills}%), Experience(${weights.experience}%), Education(${weights.education}%), Certifications(${weights.certifications}%)

Respond in this exact JSON format:
{
  "overallScore": <0-100>,
  "skillMatch": <0-100>,
  "experienceMatch": <0-100>,
  "educationMatch": <0-100>,
  "certificationMatch": <0-100>,
  "aiSummary": "<2-3 sentence summary of candidate fit>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"]
}`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    const analysis = JSON.parse(content);

    // Calculate Kenyan institution bonus
    let kenyanBonus = 0;
    for (const edu of candidate.education) {
      if (edu.isKenyan) {
        if (edu.institutionTier === "top") kenyanBonus = Math.max(kenyanBonus, 5);
        else if (edu.institutionTier === "mid") kenyanBonus = Math.max(kenyanBonus, 3);
        else if (edu.institutionTier === "tvet") kenyanBonus = Math.max(kenyanBonus, 2);
        else if (edu.institutionTier === "professional") kenyanBonus = Math.max(kenyanBonus, 4);
      }
    }

    const finalScore = Math.min(100, analysis.overallScore + kenyanBonus);

    await ctx.runMutation(api.rankings.create, {
      jobId: args.jobId,
      candidateId: args.candidateId,
      overallScore: finalScore,
      skillMatch: analysis.skillMatch,
      experienceMatch: analysis.experienceMatch,
      educationMatch: analysis.educationMatch,
      certificationMatch: analysis.certificationMatch,
      aiSummary: analysis.aiSummary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      kenyanInstitutionBonus: kenyanBonus,
      organizationId: args.organizationId,
    });

    return { success: true, score: finalScore };
  },
});

export const parseCvWithAi = action({
  args: {
    rawText: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `Extract structured information from this CV/Resume text. Be thorough and accurate.

CV TEXT:
${args.rawText.substring(0, 6000)}

Respond in this exact JSON format:
{
  "name": "<full name>",
  "age": "<age as number or null>",
  "dateOfBirth": "<date of birth or null>",
  "email": "<email or null>",
  "phone": "<phone or null>",
  "summary": "<brief professional summary>",
  "education": [
    {
      "institution": "<institution name>",
      "degree": "<degree title>",
      "field": "<field of study or null>",
      "year": "<graduation year or null>"
    }
  ],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<duration e.g. '2 years' or 'Jan 2020 - Dec 2022'>",
      "description": "<brief description>"
    }
  ],
  "skills": ["<skill1>", "<skill2>"],
  "certifications": ["<cert1>", "<cert2>"]
}`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    return JSON.parse(content);
  },
});

export const analyzeBatch = action({
  args: {
    candidateIds: v.array(v.id("candidates")),
    jobId: v.id("jobs"),
    organizationId: v.string(),
    batchId: v.id("uploadBatches"),
  },
  handler: async (ctx, args) => {
    let processed = 0;
    let failed = 0;

    // Process in chunks of 5 to avoid rate limits
    const chunkSize = 5;
    for (let i = 0; i < args.candidateIds.length; i += chunkSize) {
      const chunk = args.candidateIds.slice(i, i + chunkSize);

      const results = await Promise.allSettled(
        chunk.map((candidateId) =>
          ctx.runAction(api.analysis.analyzeCv, {
            candidateId,
            jobId: args.jobId,
            organizationId: args.organizationId,
          })
        )
      );

      for (const result of results) {
        if (result.status === "fulfilled") processed++;
        else failed++;
      }

      await ctx.runMutation(api.uploadBatches.updateProgress, {
        id: args.batchId,
        processedFiles: processed,
        failedFiles: failed,
      });

      // Update job progress
      await ctx.runMutation(api.jobs.update, {
        id: args.jobId,
        analyzedCandidates: processed,
      });

      // Small delay between chunks to respect rate limits
      if (i + chunkSize < args.candidateIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await ctx.runMutation(api.uploadBatches.updateProgress, {
      id: args.batchId,
      status: failed > 0 ? "completed_with_errors" : "completed",
      processedFiles: processed,
      failedFiles: failed,
    });

    return { processed, failed };
  },
});
