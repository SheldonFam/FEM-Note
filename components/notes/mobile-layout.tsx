import Image from "next/image";
import Link from "next/link";
import { Archive, ChevronLeft, Search, Trash2, Undo2 } from "lucide-react";

import { CreateNoteFab } from "@/components/notes/create-note-fab";
import { MobileBottomNav } from "@/components/notes/mobile-bottom-nav";
import { NoteEditor, NoteEditorEmpty } from "@/components/notes/note-editor";
import { NoteList } from "@/components/notes/note-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NotesHandlers } from "@/hooks/use-notes-handlers";
import { useNotesUI } from "@/lib/stores/notes-ui";
import type { Note, NotesView } from "@/types/note";
import type { NoteDraft } from "@/lib/stores/notes-ui";

interface MobileLayoutProps {
  view: NotesView;
  autoFocusSearch?: boolean;
  heading: string;
  isSearching: boolean;
  visibleNotes: Note[];
  selectedNote: Note | null;
  content: NoteDraft;
  handlers: NotesHandlers;
}

export function MobileLayout({
  view,
  autoFocusSearch = false,
  heading,
  isSearching,
  visibleNotes,
  selectedNote,
  content,
  handlers,
}: MobileLayoutProps) {
  const query = useNotesUI((s) => s.query);
  const setQuery = useNotesUI((s) => s.setQuery);
  const activeTag = useNotesUI((s) => s.activeTag);
  const mobileEditorOpen = useNotesUI((s) => s.mobileEditorOpen);
  const setArchiveDialogOpen = useNotesUI((s) => s.setArchiveDialogOpen);
  const setDeleteDialogOpen = useNotesUI((s) => s.setDeleteDialogOpen);

  return (
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

      {!mobileEditorOpen ? (
        <div className="flex-1 border-t border-border px-4 py-5 pb-20">
          <h1 className="mb-4 text-2xl font-bold tracking-tight">
            {autoFocusSearch ? "Search" : heading}
          </h1>

          {autoFocusSearch ? (
            <>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search notes"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="pl-9"
                  autoFocus
                />
              </div>
              {isSearching ? (
                <p className="mb-4 text-sm text-muted-foreground">
                  All notes matching &ldquo;{query.trim()}&rdquo; are displayed
                  below.
                </p>
              ) : null}
            </>
          ) : null}

          <NoteList
            notes={visibleNotes}
            selectedNoteId={null}
            view={view}
            activeTag={activeTag}
            isSearching={isSearching}
            onSelectNote={handlers.handleSelectNote}
            onCreateNote={handlers.handleCreateNote}
          />
        </div>
      ) : (
        <div className="flex-1 border-t border-border pb-20">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handlers.handleMobileBack}
              className="h-auto gap-1 px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Go Back
            </Button>

            <div className="flex items-center gap-2">
              {selectedNote ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="size-9 text-muted-foreground hover:text-foreground"
                    aria-label="Delete Note"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  {selectedNote.isArchived ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handlers.handleArchiveToggle(false)}
                      className="size-9 text-muted-foreground hover:text-foreground"
                      aria-label="Restore Note"
                    >
                      <Undo2 className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setArchiveDialogOpen(true)}
                      className="size-9 text-muted-foreground hover:text-foreground"
                      aria-label="Archive Note"
                    >
                      <Archive className="size-4" />
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="px-4 py-5">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                draft={content}
                onTitleChange={handlers.handleTitleChange}
                onTagsChange={handlers.handleTagsChange}
                onContentChange={handlers.handleContentChange}
              />
            ) : (
              <NoteEditorEmpty />
            )}
          </div>
        </div>
      )}

      <CreateNoteFab
        {...(view === "all"
          ? { onClick: handlers.handleCreateNote }
          : { href: "/" })}
      />
      <MobileBottomNav />
    </div>
  );
}
