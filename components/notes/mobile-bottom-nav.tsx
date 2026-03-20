"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { bottomNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden">
      <ul className="flex items-center justify-around">
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-3",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl px-4 py-1 transition-colors",
                    isActive && "bg-primary/10",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="hidden text-xs font-medium sm:block">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
