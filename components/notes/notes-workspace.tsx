"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileArchive, Search, Settings, Trash2 } from "lucide-react";

import { AppSidebar } from "@/components/notes/app-sidebar";
import { ConfirmDialog } from "@/components/notes/confirm-dialog";
import { NoteActions } from "@/components/notes/note-actions";
import { NoteEditor, NoteEditorEmpty } from "@/components/notes/note-editor";
import { NoteList } from "@/components/notes/note-list";
import { showToast } from "@/components/notes/toast-notification";
import { Input } from "@/components/ui/input";
import {
  collectAllTags,
  createDraftNote,
  matchesQuery,
  parseTags,
} from "@/lib/notes";
import type { Note, NotesView } from "@/types/note";

interface NotesWorkspaceProps {
  initialNotes: Note[];
  view: NotesView;
}

interface NoteDraft {
  title: string;
  tags: string;
  content: string;
}

const emptyDraft: NoteDraft = {
  title: "",
  tags: "",
  content: "",
};

function toDraft(note: Note): NoteDraft {
  return {
    title: note.title,
    tags: note.tags.join(", "),
    content: note.content,
  };
}

export function NotesWorkspace({
  initialNotes,
  view,
}: NotesWorkspaceProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftNoteId, setDraftNoteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const allTags = useMemo(() => collectAllTags(notes), [notes]);

  const isSearching = query.trim().length > 0;

  const visibleNotes = useMemo(() => {
    if (isSearching) {
      return notes.filter((note) => matchesQuery(note, query));
    }

    const shouldBeArchived = view === "archived";
    return notes
      .filter((note) => note.isArchived === shouldBeArchived)
      .filter((note) => {
        const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
        return matchesTag;
      });
  }, [activeTag, isSearching, notes, query, view]);

  const selectedNote = useMemo(() => {
    if (!visibleNotes.length) {
      return null;
    }

    return visibleNotes.find((note) => note.id === selectedId) ?? visibleNotes[0];
  }, [selectedId, visibleNotes]);

  const currentDraft =
    selectedNote && draftNoteId === selectedNote.id ? draft : selectedNote ? toDraft(selectedNote) : emptyDraft;

  const parsedDraftTags = useMemo(
    () => parseTags(currentDraft.tags),
    [currentDraft.tags]
  );

  const isNewDraft = selectedNote?.id.startsWith("draft-") ?? false;

  const isDirty = selectedNote
    ? isNewDraft ||
      selectedNote.title !== currentDraft.title ||
      selectedNote.content !== currentDraft.content ||
      selectedNote.tags.join("|") !== parsedDraftTags.join("|")
    : false;

  const heading = isSearching
    ? `Showing results for: ${query.trim()}`
    : activeTag
      ? `Notes Tagged: ${activeTag}`
      : view === "archived"
        ? "Archived Notes"
        : "All Notes";

  function handleCreateNote() {
    const newNote = createDraftNote();
    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setActiveTag(null);
    setQuery("");
    setSelectedId(newNote.id);
    setDraftNoteId(newNote.id);
    setDraft(toDraft(newNote));
  }

  function updateDraft(updater: (draftValue: NoteDraft) => NoteDraft) {
    setDraftNoteId(selectedNote?.id ?? null);
    setDraft((currentDraftValue) =>
      updater(draftNoteId === selectedNote?.id ? currentDraftValue : currentDraft)
    );
  }

  function handleSaveNote() {
    if (!selectedNote) {
      return;
    }

    const title = currentDraft.title.trim();
    if (!title) {
      setValidationError("Title is required. Please enter a note title.");
      return;
    }

    setValidationError(null);

    const previousTags = selectedNote.tags;
    const savedNote: Note = {
      ...selectedNote,
      title,
      tags: parsedDraftTags,
      content: currentDraft.content,
      lastEdited: new Date().toISOString(),
    };

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNote.id ? savedNote : note
      )
    );
    setDraftNoteId(savedNote.id);
    setDraft(toDraft(savedNote));

    showToast("Note saved successfully!");

    const addedCount = parsedDraftTags.filter((t) => !previousTags.includes(t)).length;
    const removedCount = previousTags.filter((t) => !parsedDraftTags.includes(t)).length;
    for (let i = 0; i < addedCount; i++) {
      showToast("Tag added successfully!");
    }
    for (let i = 0; i < removedCount; i++) {
      showToast("Tag removed successfully!");
    }
  }

  function handleCancel() {
    if (!selectedNote) {
      return;
    }

    setValidationError(null);

    if (selectedNote.id.startsWith("draft-")) {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== selectedNote.id)
      );
      setSelectedId(null);
      setDraftNoteId(null);
      setDraft(emptyDraft);
      return;
    }

    setDraftNoteId(selectedNote.id);
    setDraft(toDraft(selectedNote));
  }

  function handleArchiveToggle(shouldArchive: boolean) {
    if (!selectedNote) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              isArchived: shouldArchive,
              lastEdited: new Date().toISOString(),
            }
          : note
      )
    );
    setSelectedId(null);
    setIsArchiveDialogOpen(false);

    if (shouldArchive) {
      showToast("Note archived.", {
        linkLabel: "Archived Notes",
        linkHref: "/archived",
      });
    } else {
      showToast("Note restored to active notes.", {
        linkLabel: "All Notes",
        linkHref: "/",
      });
    }
  }

  function handleDeleteNote() {
    if (!selectedNote) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== selectedNote.id)
    );
    setSelectedId(null);
    setIsDeleteDialogOpen(false);
    showToast("Note permanently deleted.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)]">
        <AppSidebar
          tags={allTags}
          activeTag={activeTag}
          currentView={view}
          onTagSelect={setActiveTag}
        />

        <div className="flex min-h-screen flex-col">
          <header className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm flex-1 lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search notes"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="pl-9"
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
              onSelectNote={setSelectedId}
              onCreateNote={handleCreateNote}
            />

            <section className="border-b border-border px-6 py-5 md:border-b-0 xl:border-r lg:px-8">
              {selectedNote ? (
                <NoteEditor
                  note={selectedNote}
                  draft={currentDraft}
                  isDirty={isDirty}
                  validationError={validationError}
                  onTitleChange={(value) => {
                    if (validationError) setValidationError(null);
                    updateDraft((d) => ({ ...d, title: value }));
                  }}
                  onTagsChange={(value) =>
                    updateDraft((d) => ({ ...d, tags: value }))
                  }
                  onContentChange={(value) =>
                    updateDraft((d) => ({ ...d, content: value }))
                  }
                  onSave={handleSaveNote}
                  onCancel={handleCancel}
                />
              ) : (
                <NoteEditorEmpty />
              )}
            </section>

            <NoteActions
              note={selectedNote}
              onArchive={() => setIsArchiveDialogOpen(true)}
              onRestore={() => handleArchiveToggle(false)}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        icon={FileArchive}
        title="Archive Note"
        description="Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime."
        confirmLabel="Archive Note"
        onConfirm={() => handleArchiveToggle(true)}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        icon={Trash2}
        title="Delete Note"
        description="Are you sure you want to permanently delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        confirmVariant="destructive"
        onConfirm={handleDeleteNote}
      />
    </div>
  );
}
