"use client";

import Image from "next/image";
import Link from "next/link";
import { Archive, ChevronRight, Home, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <aside className="hidden h-full flex-col border-r border-border bg-sidebar px-5 py-5 md:flex">
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
              {isActive ? <ChevronRight className="size-4" /> : null}
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

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {tags.map((tag) => {
            const isActive = activeTag === tag;

            return (
              <Button
                key={tag}
                type="button"
                variant="ghost"
                onClick={() => onTagSelect?.(isActive ? null : tag)}
                className={cn(
                  "h-auto w-full justify-between rounded-xl px-3 py-2.5 text-sm",
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
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
