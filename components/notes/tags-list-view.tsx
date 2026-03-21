"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";

import { AuthGuard } from "@/components/auth-guard";
import { CreateNoteFab } from "@/components/notes/create-note-fab";
import { MobileBottomNav } from "@/components/notes/mobile-bottom-nav";
import { useTags } from "@/hooks/use-notes-queries";

export function TagsListView() {
  const router = useRouter();
  const { data: tags, isLoading } = useTags();

  return (
    <AuthGuard>
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

          {isLoading ? (
            <div className="mt-4 flex justify-center">
              <div className="size-6 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : (
            <ul className="mt-4">
              {(tags ?? []).map((tag) => (
                <li key={tag.id} className="border-b border-border last:border-b-0">
                  <Link
                    href={`/?tag=${encodeURIComponent(tag.name)}`}
                    className="flex items-center gap-3 py-4 text-sm text-foreground transition-colors hover:text-primary"
                  >
                    <Tag className="size-4 text-muted-foreground" />
                    {tag.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {tag.noteCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <CreateNoteFab onClick={() => router.push("/")} />
        <MobileBottomNav />
        <div className="h-16" />
      </div>
    </AuthGuard>
  );
}
