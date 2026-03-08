"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lock, LogOut, Palette, Search, Settings, Type } from "lucide-react";
import { useTheme } from "next-themes";

import { showToast } from "@/components/notes/toast-notification";

import { AppSidebar } from "@/components/notes/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  applyFontTheme,
  getStoredFontTheme,
  type FontTheme,
} from "@/lib/font-theme";
import { seededNotes } from "@/lib/notes";
import { cn } from "@/lib/utils";

type ThemeValue = "light" | "dark" | "system";
type SettingsSection = "theme" | "font";

const settingsItems = [
  {
    id: "theme" as const,
    label: "Color Theme",
    icon: Palette,
  },
  {
    id: "font" as const,
    label: "Font Theme",
    icon: Type,
  },
  {
    id: "password" as const,
    label: "Change Password",
    icon: Lock,
    disabled: true,
  },
  {
    id: "logout" as const,
    label: "Logout",
    icon: LogOut,
    disabled: true,
  },
];

type SettingsItem = (typeof settingsItems)[number];

function isSectionItem(
  item: SettingsItem,
): item is Extract<SettingsItem, { id: SettingsSection }> {
  return item.id === "theme" || item.id === "font";
}

const themeOptions = [
  {
    value: "light" as const,
    title: "Light Mode",
    description: "Pick a clean and classic light theme",
  },
  {
    value: "dark" as const,
    title: "Dark Mode",
    description: "Select a sleek and modern dark theme",
  },
  {
    value: "system" as const,
    title: "System",
    description: "Adapts to your device's theme",
  },
];

const fontOptions = [
  {
    value: "sans" as const,
    title: "Sans-serif",
    description: "Clean and modern, easy to read.",
    sampleClassName: "font-sans",
  },
  {
    value: "serif" as const,
    title: "Serif",
    description: "Classic and elegant for a timeless feel.",
    sampleClassName: "font-serif",
  },
  {
    value: "mono" as const,
    title: "Monospace",
    description: "Code-like, great for a technical vibe.",
    sampleClassName: "font-mono",
  },
];

export function SettingsPanel() {
  const tags = useMemo(() => {
    return [...new Set(seededNotes.flatMap((note) => note.tags))].sort();
  }, []);
  const { theme, setTheme } = useTheme();
  const currentTheme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  const [activeSection, setActiveSection] = useState<SettingsSection>("theme");
  const [pendingTheme, setPendingTheme] = useState<ThemeValue | null>(null);
  const [pendingFontTheme, setPendingFontTheme] = useState<FontTheme>(() =>
    getStoredFontTheme(),
  );

  function handleApplyChanges() {
    setTheme(pendingTheme ?? currentTheme);
    applyFontTheme(pendingFontTheme);
    showToast("Settings updated successfully!");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)]">
        <AppSidebar tags={tags} currentView="settings" />

        <div className="flex min-h-screen flex-col">
          <header className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm flex-1 lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  readOnly
                  aria-label="Search notes"
                  placeholder="Search by title, content, or tags..."
                  className="pl-9"
                />
              </div>

              <Link
                href="/settings"
                className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-accent text-foreground"
                aria-label="Open settings"
              >
                <Settings className="size-4" />
              </Link>
            </div>
          </header>

          <div className="grid flex-1 md:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-b border-border px-6 py-5 md:border-r md:border-b-0">
              <nav className="space-y-1">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeSection;

                  if (!isSectionItem(item)) {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4" />
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <section className="px-6 py-6 lg:px-8">
              {activeSection === "theme" ? (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold">Color Theme</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose your color theme:
                  </p>

                  <RadioGroup
                    value={pendingTheme ?? currentTheme}
                    onValueChange={(value) =>
                      setPendingTheme(value as ThemeValue)
                    }
                    className="mt-6"
                  >
                    {themeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                            <Palette className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {option.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <RadioGroupItem value={option.value} />
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold">Font Theme</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose your font theme:
                  </p>

                  <RadioGroup
                    value={pendingFontTheme}
                    onValueChange={(value) =>
                      setPendingFontTheme(value as FontTheme)
                    }
                    className="mt-6"
                  >
                    {fontOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "flex size-10 items-center justify-center rounded-xl border border-border bg-background text-base text-muted-foreground",
                              option.sampleClassName,
                            )}
                          >
                            Aa
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-semibold",
                                option.sampleClassName,
                              )}
                            >
                              {option.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <RadioGroupItem value={option.value} />
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={handleApplyChanges}>
                  Apply Changes
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
