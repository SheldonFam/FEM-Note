import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Settings } from "lucide-react";

import { AppSidebar } from "@/components/notes/app-sidebar";
import { NoteActions } from "@/components/notes/note-actions";
import { NoteEditor, NoteEditorEmpty } from "@/components/notes/note-editor";
import { NoteList } from "@/components/notes/note-list";
import { Input } from "@/components/ui/input";
import type { NotesHandlers } from "@/hooks/use-notes-handlers";
import { useNotesUI } from "@/lib/stores/notes-ui";
import type { Note, NotesView } from "@/types/note";
import type { NoteDraft } from "@/lib/stores/notes-ui";

interface DesktopLayoutProps {
  view: NotesView;
  autoFocusSearch: boolean;
  allTags: string[];
  heading: string;
  isSearching: boolean;
  visibleNotes: Note[];
  selectedNote: Note | null;
  content: NoteDraft;
  handlers: NotesHandlers;
}

export function DesktopLayout({
  view,
  autoFocusSearch,
  allTags,
  heading,
  isSearching,
  visibleNotes,
  selectedNote,
  content,
  handlers,
}: DesktopLayoutProps) {
  const router = useRouter();
  const query = useNotesUI((s) => s.query);
  const setQuery = useNotesUI((s) => s.setQuery);
  const activeTag = useNotesUI((s) => s.activeTag);
  const setArchiveDialogOpen = useNotesUI((s) => s.setArchiveDialogOpen);
  const setDeleteDialogOpen = useNotesUI((s) => s.setDeleteDialogOpen);

  const handleCreate =
    view === "all" ? handlers.handleCreateNote : () => router.push("/");

  return (
    <div className="hidden min-h-screen md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <AppSidebar
        tags={allTags}
        activeTag={activeTag}
        currentView={view}
        onTagSelect={handlers.handleTagSelect}
      />

      <div className="flex min-h-screen flex-col">
        <header className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>

          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-sm flex-1 lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="notes-search"
                aria-label="Search notes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, content, or tags..."
                className="pl-9"
                autoFocus={autoFocusSearch}
              />
            </div>

            <Link
              href="/settings"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Open settings"
            >
              <Settings className="size-4" />
            </Link>
          </div>
        </header>

        <div className="grid flex-1 md:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)_220px]">
          <NoteList
            notes={visibleNotes}
            selectedNoteId={selectedNote?.id ?? null}
            view={view}
            activeTag={activeTag}
            isSearching={isSearching}
            onSelectNote={handlers.handleSelectNote}
            onCreateNote={handleCreate}
          />

          <section className="px-6 py-5 xl:border-r xl:border-border lg:px-8">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                draft={content}
                onTitleChange={handlers.handleTitleChange}
                onTagsChange={handlers.handleTagsChange}
                onTagsBlur={handlers.handleTagsBlur}
                onContentChange={handlers.handleContentChange}
              />
            ) : (
              <NoteEditorEmpty />
            )}
          </section>

          <NoteActions
            note={selectedNote}
            onArchive={() => setArchiveDialogOpen(true)}
            onRestore={() => handlers.handleArchiveToggle(false)}
            onDelete={() => setDeleteDialogOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}
