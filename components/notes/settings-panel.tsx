"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock, LogOut, Palette, Search, Settings, Type } from "lucide-react";
import { useTheme } from "next-themes";

import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/notes/app-sidebar";
import { MobileBottomNav } from "@/components/notes/mobile-bottom-nav";
import { ChangePasswordSection } from "@/components/notes/settings/change-password-section";
import { ColorThemeSection } from "@/components/notes/settings/color-theme-section";
import { FontThemeSection } from "@/components/notes/settings/font-theme-section";
import { showToast } from "@/components/notes/toast-notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/hooks/use-auth";
import { useTags } from "@/hooks/use-notes-queries";
import { useUpdatePreferences } from "@/hooks/use-notes-mutations";
import {
  applyFontTheme,
  getStoredFontTheme,
  type FontTheme,
} from "@/lib/font-theme";
import { cn } from "@/lib/utils";

type ThemeValue = "light" | "dark" | "system";
type SettingsSection = "theme" | "font" | "password";

const settingsItems = [
  { id: "theme" as const, label: "Color Theme", icon: Palette },
  { id: "font" as const, label: "Font Theme", icon: Type },
  { id: "password" as const, label: "Change Password", icon: Lock },
  { id: "logout" as const, label: "Logout", icon: LogOut },
];

type SettingsItem = (typeof settingsItems)[number];

function isSectionItem(
  item: SettingsItem,
): item is Extract<SettingsItem, { id: SettingsSection }> {
  return item.id === "theme" || item.id === "font" || item.id === "password";
}

export function SettingsPanel() {
  const { data: tagsData } = useTags();
  const tags = (tagsData ?? []).map((t) => t.name);
  const logoutMutation = useLogout();
  const updatePrefs = useUpdatePreferences();
  const { theme, setTheme } = useTheme();
  const currentTheme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);
  const [pendingTheme, setPendingTheme] = useState<ThemeValue | null>(null);
  const [pendingFontTheme, setPendingFontTheme] = useState<FontTheme>(() =>
    getStoredFontTheme(),
  );

  function handleApplyThemeChanges() {
    const newTheme = pendingTheme ?? currentTheme;
    setTheme(newTheme);
    setPendingTheme(null);
    updatePrefs.mutate({ colorTheme: newTheme });
    showToast("Settings updated successfully!");
  }

  function handleApplyFontChanges() {
    applyFontTheme(pendingFontTheme);
    updatePrefs.mutate({ fontTheme: pendingFontTheme });
    showToast("Settings updated successfully!");
  }

  const resolvedSection = activeSection ?? "theme";

  const settingsMenu = (
    <nav className="space-y-1">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === resolvedSection;

        if (!isSectionItem(item)) {
          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              onClick={() => logoutMutation.mutate()}
              className="h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          );
        }

        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "h-auto w-full justify-between rounded-xl px-3 py-3 text-sm font-medium",
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" />
              {item.label}
            </span>
            <ChevronRight className="size-4 md:hidden" />
          </Button>
        );
      })}
    </nav>
  );

  const settingsContent = (
    <section className="px-6 py-6 lg:px-8">
      {resolvedSection === "theme" ? (
        <ColorThemeSection
          value={pendingTheme ?? currentTheme}
          onValueChange={setPendingTheme}
          onApply={handleApplyThemeChanges}
        />
      ) : resolvedSection === "font" ? (
        <FontThemeSection
          value={pendingFontTheme}
          onValueChange={setPendingFontTheme}
          onApply={handleApplyFontChanges}
        />
      ) : (
        <ChangePasswordSection />
      )}
    </section>
  );

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop layout */}
      <div className="hidden min-h-screen md:grid md:grid-cols-[260px_minmax(0,1fr)]">
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
            <aside className="border-r border-border px-6 py-5">
              {settingsMenu}
            </aside>
            {settingsContent}
          </div>
        </div>
      </div>

      {/* Mobile layout — step-based */}
      <div className="flex min-h-screen flex-col md:hidden">
        <div className="px-4 py-5">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/assets/images/logo.svg"
              alt="Notes"
              width={95}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>
        </div>

        {activeSection === null ? (
          <div className="border-t border-border px-4 py-5 pb-20">
            <h1 className="mb-4 text-2xl font-bold tracking-tight">Settings</h1>
            {settingsMenu}
          </div>
        ) : (
          <div className="border-t border-border px-4 py-5 pb-20">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveSection(null)}
              className="mb-4 h-auto gap-1 px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Settings
            </Button>
            {settingsContent}
          </div>
        )}

        <MobileBottomNav />
      </div>
    </div>
    </AuthGuard>
  );
}
