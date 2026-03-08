"use client";

import Image from "next/image";
import Link from "next/link";
import { Archive, ChevronRight, Home, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  tags: string[];
  activeTag?: string | null;
  currentView: "all" | "archived" | "settings";
  onTagSelect?: (tag: string | null) => void;
}

const navigationItems = [
  {
    href: "/",
    label: "All Notes",
    icon: Home,
    view: "all" as const,
  },
  {
    href: "/archived",
    label: "Archived Notes",
    icon: Archive,
    view: "archived" as const,
  },
];

export function AppSidebar({
  tags,
  activeTag = null,
  currentView,
  onTagSelect,
}: AppSidebarProps) {
  return (
    <aside className="flex h-full flex-col border-b border-border bg-sidebar px-4 py-5 md:border-r md:border-b-0 md:px-5">
      <div className="mb-8 flex items-center">
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

      <nav className="space-y-1">
        {navigationItems.map(({ href, label, icon: Icon, view }) => {
          const isActive = currentView === view;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {label}
              </span>
              <ChevronRight className="size-4" />
            </Link>
          );
        })}
      </nav>

      <div className="my-6 h-px bg-border" />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Tags</h2>
        {activeTag ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-0 text-xs font-medium text-primary hover:bg-transparent hover:text-primary"
            onClick={() => onTagSelect?.(null)}
          >
            Clear
          </Button>
        ) : null}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {tags.map((tag) => {
            const isActive = activeTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagSelect?.(isActive ? null : tag)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-3">
                  <Tag className="size-4" />
                  {tag}
                </span>
                {isActive ? <ChevronRight className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
