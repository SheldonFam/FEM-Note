"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const fabClassName =
  "fixed bottom-20 right-4 z-50 size-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 md:hidden";

interface CreateNoteFabProps {
  onClick?: () => void;
  href?: string;
}

export function CreateNoteFab({ onClick, href }: CreateNoteFabProps) {
  if (href) {
    return (
      <Button asChild aria-label="Create new note" className={fabClassName}>
        <Link href={href}>
          <Plus className="size-6" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label="Create new note"
      className={fabClassName}
    >
      <Plus className="size-6" />
    </Button>
  );
}
