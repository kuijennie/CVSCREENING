"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themes = [
    { value: "light", label: "Light", icon: Sun, description: "Classic light appearance" },
    { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
    { value: "system", label: "System", icon: Monitor, description: "Match your OS setting" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-[var(--border)]"
            />
          )}
          <div>
            <p className="font-medium text-lg">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              ID: {user?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Choose how CVScreen AI looks to you. Select a single theme or sync with your system.
        </p>
        {mounted && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                  theme === value
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{label}</span>
                    {theme === value && (
                      <Check className="h-4 w-4 text-[var(--primary)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scoring Defaults */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Default Scoring Weights</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Set default weights for how candidates are scored. Individual jobs can override these.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Skills Match</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={40}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10">40%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={30}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10">30%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={20}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10">20%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Certifications</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={10}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kenyan Institutions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Kenyan Institution Recognition</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          The platform automatically recognizes 70+ Kenyan educational institutions and professional bodies,
          organized by tier for bonus scoring.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">Top Tier</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              UoN, KU, JKUAT, Strathmore, USIU, Moi, Egerton
            </p>
            <p className="text-xs font-medium text-emerald-600 mt-1">+5 bonus</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Professional</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              KASNEB, ICPAK, LSK, EBK, KMPDC
            </p>
            <p className="text-xs font-medium text-purple-600 mt-1">+4 bonus</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Universities</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Maseno, DeKUT, TUK, MMU, KCA, MKU, Daystar...
            </p>
            <p className="text-xs font-medium text-blue-600 mt-1">+3 bonus</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">TVET</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Kenya Poly, Mombasa Poly, KMTC, KIM
            </p>
            <p className="text-xs font-medium text-amber-600 mt-1">+2 bonus</p>
          </div>
        </div>
      </div>
    </div>
  );
}
