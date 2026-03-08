import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNoteDate } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Note, NotesView } from "@/types/note";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  view: NotesView;
  activeTag: string | null;
  isSearching: boolean;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  view,
  activeTag,
  isSearching,
  onSelectNote,
  onCreateNote,
}: NoteListProps) {
  return (
    <aside className="border-b border-border px-6 py-5 md:border-r md:border-b-0 lg:px-6">
      {view === "all" ? (
        <Button
          type="button"
          className="mb-4 w-full"
          onClick={onCreateNote}
        >
          <Plus className="size-4" />
          Create New Note
        </Button>
      ) : (
        <Button asChild className="mb-4 w-full">
          <Link href="/">
            <Plus className="size-4" />
            Create New Note
          </Link>
        </Button>
      )}

      {view === "archived" && !isSearching ? (
        <p className="mb-4 max-w-xs text-sm leading-6 text-muted-foreground">
          All your archived notes are stored here. You can restore or
          delete them anytime.
        </p>
      ) : null}

      {activeTag && !isSearching ? (
        <p className="mb-4 max-w-xs text-sm leading-6 text-muted-foreground">
          All notes with the &ldquo;{activeTag}&rdquo; tag are shown
          here.
        </p>
      ) : null}

      <div className="space-y-1">
        {notes.length ? (
          notes.map((note) => {
            const isActive = note.id === selectedNoteId;

            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "w-full rounded-2xl border border-transparent px-4 py-3 text-left transition-colors",
                  isActive
                    ? "bg-accent"
                    : "hover:border-border hover:bg-card"
                )}
              >
                <h2 className="line-clamp-2 text-base font-semibold">
                  {note.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-tag px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatNoteDate(note.lastEdited)}
                </p>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-5">
            <p className="text-sm leading-6 text-muted-foreground">
              No notes match your search. Try a different keyword or{" "}
              <button
                type="button"
                onClick={onCreateNote}
                className="font-medium text-foreground underline underline-offset-2"
              >
                create a new note
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
