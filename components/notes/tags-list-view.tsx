"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Tag } from "lucide-react";

import { CreateNoteFab } from "@/components/notes/create-note-fab";
import { MobileBottomNav } from "@/components/notes/mobile-bottom-nav";
import { collectAllTags } from "@/lib/notes";
import type { Note } from "@/types/note";

interface TagsListViewProps {
  initialNotes: Note[];
}

export function TagsListView({ initialNotes }: TagsListViewProps) {
  const router = useRouter();
  const tags = useMemo(() => collectAllTags(initialNotes), [initialNotes]);

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <div className="border-t border-border px-4 py-5">
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>

        <ul className="mt-4">
          {tags.map((tag) => (
            <li key={tag} className="border-b border-border last:border-b-0">
              <Link
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-3 py-4 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Tag className="size-4 text-muted-foreground" />
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <CreateNoteFab onClick={() => router.push("/")} />
      <MobileBottomNav />
      <div className="h-16" />
    </div>
  );
}
