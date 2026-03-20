import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNoteDate } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Note, NotesView } from "@/types/note";

interface NoteListItemProps {
  note: Note;
}

function NoteListItem({ note }: NoteListItemProps) {
  return (
    <>
      <h2 className="line-clamp-2 text-base font-semibold">
        {note.title || "Untitled Note"}
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
    </>
  );
}

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
    <aside className="md:border-r md:border-b-0 md:px-6 md:py-5 lg:px-6">
      <Button
        type="button"
        className="mb-4 hidden w-full md:inline-flex"
        onClick={onCreateNote}
      >
        <Plus className="size-4" />
        Create New Note
      </Button>

      {view === "archived" && !isSearching ? (
        <p className="mb-4 max-w-xs text-sm leading-6 text-muted-foreground">
          All your archived notes are stored here. You can restore or delete
          them anytime.
        </p>
      ) : null}

      {activeTag && !isSearching ? (
        <p className="mb-4 max-w-xs text-sm leading-6 text-muted-foreground">
          All notes with the &ldquo;{activeTag}&rdquo; tag are shown here.
        </p>
      ) : null}

      {/* Desktop: list with dividers */}
      <div className="hidden divide-y divide-border md:block">
        {notes.length ? (
          notes.map((note) => {
            const isActive = note.id === selectedNoteId;

            return (
              <Button
                key={note.id}
                type="button"
                variant="unstyled"
                size="none"
                aria-current={isActive || undefined}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "w-full rounded-lg px-4 py-3 text-left transition-colors",
                  isActive ? "bg-accent" : "hover:bg-card",
                )}
              >
                <NoteListItem note={note} />
              </Button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E0E4EA] bg-[#F3F5F8] px-4 py-5">
            <p className="text-sm leading-6 text-muted-foreground">
              {view === "all"
                ? "You don\u2019t have any notes yet. Start a new note to capture your thoughts and ideas."
                : <>No notes have been archived yet. Move notes here for safekeeping, or{" "}<Button type="button" variant="unstyled" size="none" onClick={onCreateNote} className="font-medium text-foreground underline underline-offset-2">create a new note</Button>.</>}
            </p>
          </div>
        )}
      </div>

      {/* Mobile: flat list with separator lines */}
      <div className="divide-y divide-border md:hidden">
        {notes.length ? (
          notes.map((note) => (
            <Button
              key={note.id}
              type="button"
              variant="unstyled"
              size="none"
              onClick={() => onSelectNote(note.id)}
              className="w-full py-4 text-left transition-colors first:pt-0"
            >
              <NoteListItem note={note} />
            </Button>
          ))
        ) : (
          <div className="py-5">
            <p className="text-sm leading-6 text-muted-foreground">
              {view === "all"
                ? "You don\u2019t have any notes yet. Start a new note to capture your thoughts and ideas."
                : <>No notes have been archived yet. Move notes here for safekeeping, or{" "}<Button type="button" variant="unstyled" size="none" onClick={onCreateNote} className="font-medium text-foreground underline underline-offset-2">create a new note</Button>.</>}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
