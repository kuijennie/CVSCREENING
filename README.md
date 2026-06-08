# CV Screening System

An AI-powered CV screening and candidate ranking web application built for HR teams. It automates the process of evaluating job applicants by parsing uploaded CVs and scoring them against job requirements.

## Features

- **CV Upload & Parsing** — Upload CVs in PDF or DOCX format. An AI model extracts structured data (skills, education, experience, certifications) from each document.
- **AI Analysis & Ranking** — Candidates are scored against a job's requirements using configurable weights for skills, experience, education, and certifications. A short AI-generated summary is produced for each candidate.
- **Job Management** — Create jobs with specific requirements, scoring weights, and custom criteria. Track how many candidates have been analyzed per job.
- **Candidate Anonymization** — Admins can enable per-organization anonymization, which hides candidate names, age, gender, and contact details during screening to reduce hiring bias.
- **Admin Panel** — Super-admin dashboard for managing organizations, viewing platform-wide stats, controlling anonymization settings, and suspending/reinstating organization accounts.
- **Kenyan Institution Bonus** — Candidates with degrees from recognized Kenyan institutions receive a small score bonus based on institution tier.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Backend / Database | Convex |
| Authentication | Clerk |
| AI | OpenAI GPT-4o |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Language | TypeScript |

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables** — create a `.env.local` file with your Clerk, Convex, and OpenAI keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CONVEX_URL=
   OPENAI_API_KEY=
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Start the Convex backend** (in a separate terminal)
   ```bash
   npx convex dev
   ```
