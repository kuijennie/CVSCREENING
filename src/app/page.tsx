import Link from "next/link";
import {
  Upload,
  BarChart3,
  Users,
  GraduationCap,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  BriefcaseBusiness,
  ScanSearch,
  ListChecks,
  BookOpen,
  Wrench,
  Award,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  KENYAN_INSTITUTIONS,
  type InstitutionTier,
} from "@/lib/kenyan-institutions";

// ─── Tier display config ─────────────────────────────────────────────────────
const TIER_CONFIG: Record<
  InstitutionTier,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  top: {
    label: "Top University",
    icon: <GraduationCap className="h-3 w-3" />,
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.25)",
  },
  mid: {
    label: "University",
    icon: <BookOpen className="h-3 w-3" />,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.25)",
  },
  tvet: {
    label: "TVET",
    icon: <Wrench className="h-3 w-3" />,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.25)",
  },
  professional: {
    label: "Professional",
    icon: <Award className="h-3 w-3" />,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.25)",
  },
  other: {
    label: "Institution",
    icon: <GraduationCap className="h-3 w-3" />,
    color: "var(--muted-foreground)",
    bg: "transparent",
    border: "var(--border)",
  },
};

// Build a curated marquee set: mix of all tiers, prioritise named ones
const MARQUEE_INSTITUTIONS = [
  ...KENYAN_INSTITUTIONS.filter((i) => i.tier === "top"),
  ...KENYAN_INSTITUTIONS.filter((i) => i.tier === "professional"),
  ...KENYAN_INSTITUTIONS.filter((i) => i.tier === "tvet").slice(0, 5),
  ...KENYAN_INSTITUTIONS.filter((i) => i.tier === "mid").slice(0, 8),
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-outer {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 12%,
            black 88%,
            transparent 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 12%,
            black 88%,
            transparent 100%
          );
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .institution-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--card);
          font-size: 0.78rem;
          white-space: nowrap;
          color: var(--muted-foreground);
          margin: 0 5px;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .institution-pill:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .tier-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 999px;
          letter-spacing: 0.03em;
        }
        .marquee-divider {
          display: inline-flex;
          align-items: center;
          margin: 0 10px;
          color: var(--border);
          font-size: 0.6rem;
          user-select: none;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-card {
          animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .step-card:nth-child(1) { animation-delay: 0.1s; }
        .step-card:nth-child(2) { animation-delay: 0.2s; }
        .step-card:nth-child(3) { animation-delay: 0.3s; }

        .cta-glow {
          position: relative;
          overflow: hidden;
        }
        .cta-glow::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, var(--primary), transparent 60%);
          border-radius: inherit;
          opacity: 0.18;
          pointer-events: none;
        }

        .step-number {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          color: var(--primary);
          opacity: 0.08;
          letter-spacing: -0.04em;
          position: absolute;
          top: -4px;
          right: 16px;
          pointer-events: none;
          user-select: none;
        }
        .step-connector {
          display: none;
        }
        @media (min-width: 768px) {
          .step-connector {
            display: block;
            position: absolute;
            top: 34px;
            left: 100%;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, var(--border) 60%, transparent);
            z-index: 0;
          }
        }
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
          background: color-mix(in srgb, var(--primary) 8%, transparent);
          font-size: 0.72rem;
          color: var(--primary);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CVScreen AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--secondary)] text-sm text-[var(--muted-foreground)] mb-6">
          <Zap className="h-3 w-3 text-[var(--primary)]" />
          AI-Powered CV Screening
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
          Screen <span className="text-[var(--primary)]">1000 CVs</span> in
          minutes,
          <br />
          not weeks
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
          Upload bulk CVs, let AI analyze and rank candidates against your job
          requirements. Recognizes Kenyan educational institutions with smart
          matching.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity text-lg"
          >
            Start Screening
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors text-lg"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Marquee Strip */}
      <div
        className="py-4"
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--secondary)",
        }}
      >
        {/* Tier legend */}
        <div className="flex items-center justify-center gap-4 mb-3 flex-wrap px-4">
          {(["top", "mid", "tvet", "professional"] as InstitutionTier[]).map(
            (tier) => {
              const cfg = TIER_CONFIG[tier];
              const count = KENYAN_INSTITUTIONS.filter(
                (i) => i.tier === tier
              ).length;
              return (
                <span
                  key={tier}
                  className="inline-flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: cfg.bg,
                      color: cfg.color,
                      border: `1px solid ${cfg.border}`,
                    }}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.7rem" }}>
                    {count}
                  </span>
                </span>
              );
            }
          )}
        </div>

        {/* Scrolling track */}
        <div className="marquee-outer">
          <div className="marquee-track">
            {/* Render twice for seamless infinite loop */}
            {[...MARQUEE_INSTITUTIONS, ...MARQUEE_INSTITUTIONS].map(
              (inst, i) => {
                const cfg = TIER_CONFIG[inst.tier];
                return (
                  <span key={i} className="institution-pill">
                    <span
                      className="tier-badge"
                      style={{
                        background: cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      {cfg.icon}
                    </span>
                    {inst.name}
                  </span>
                );
              }
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[var(--muted-foreground)] mt-3 tracking-widest uppercase">
          {KENYAN_INSTITUTIONS.length} Kenyan institutions recognized automatically
        </p>
      </div>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to hire smarter
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="Bulk Upload"
            description="Upload up to 1000 CVs at once. Supports PDF and DOCX formats with drag & drop."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="AI Ranking"
            description="OpenAI-powered analysis scores candidates on skills, experience, education, and certifications."
          />
          <FeatureCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Kenyan Institutions"
            description="Automatically recognizes 70+ Kenyan universities, TVETs, and professional bodies with tier badges."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Real-time Processing"
            description="Watch rankings update live as CVs are analyzed. Powered by Convex real-time database."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Organization Accounts"
            description="Secure team access with Clerk authentication. Manage roles and permissions."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Smart Filtering"
            description="Filter by score, skills, education level, institution tier. Export to CSV."
          />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--secondary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">
              Simple by design
            </p>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Your shortlist in 3 steps
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">
              From job post to ranked candidates. No manual screening, no spreadsheets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              {
                num: "01",
                icon: <BriefcaseBusiness className="h-6 w-6" />,
                title: "Post your job",
                description:
                  "Define the role, required skills, experience level, and education criteria. This becomes the AI's scoring rubric.",
                detail: "Takes under 2 minutes",
              },
              {
                num: "02",
                icon: <ScanSearch className="h-6 w-6" />,
                title: "Upload CVs in bulk",
                description:
                  "Drop up to 1,000 PDF or DOCX files. Our pipeline parses, extracts, and enriches every candidate profile automatically.",
                detail: "PDF & DOCX supported",
              },
              {
                num: "03",
                icon: <ListChecks className="h-6 w-6" />,
                title: "Review your shortlist",
                description:
                  "Candidates are scored, ranked, and ready in minutes. Filter, compare, and export your shortlist with one click.",
                detail: "Export to CSV instantly",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="step-card relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 overflow-hidden"
              >
                <span className="step-number">{step.num}</span>
                {i < 2 && <div className="step-connector" />}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                    color: "var(--primary)",
                    border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)",
                  }}
                >
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5">
                  {step.description}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                    color: "var(--primary)",
                    border: "1px solid color-mix(in srgb, var(--primary) 18%, transparent)",
                  }}
                >
                  <CheckCircle className="h-3 w-3" />
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="cta-glow rounded-3xl p-12 text-center"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to hire smarter?
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto leading-relaxed">
              Join organizations across Kenya using AI to find the best candidates
              in minutes &amp; not weeks of manual screening.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                "AI-Powered Scoring",
                "1,000 CVs per batch",
                "Kenyan institutions",
                "Export to CSV",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted-foreground)]"
                >
                  <CheckCircle className="h-3 w-3 flex-shrink-0 text-[var(--primary)]" />
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 transition-opacity text-base"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors text-base text-[var(--muted-foreground)]"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} CVScreen AI. Built for Kenyan
          organizations.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--muted-foreground)] text-sm">{description}</p>
    </div>
  );
}