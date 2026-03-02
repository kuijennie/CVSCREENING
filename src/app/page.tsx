import Link from "next/link";
import {
  Upload,
  BarChart3,
  Users,
  GraduationCap,
  Zap,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
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

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to streamline your hiring?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            Join organizations using AI to find the best candidates faster.
          </p>
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity text-lg"
          >
            Get Started Free
          </Link>
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
