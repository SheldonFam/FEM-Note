"use client";

import { useEffect, useRef, useState } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { FullPageSpinner } from "@/components/ui/spinner";
import { DesktopLayout } from "@/components/notes/desktop-layout";
import { MobileLayout } from "@/components/notes/mobile-layout";
import { NotesDialogs } from "@/components/notes/notes-dialogs";
import { useDerivedNotes } from "@/hooks/use-derived-notes";
import { useEditorContent } from "@/hooks/use-editor-content";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useNotesHandlers } from "@/hooks/use-notes-handlers";
import { useNotes } from "@/hooks/use-notes-queries";
import { useTags } from "@/hooks/use-notes-queries";
import { useNotesUI } from "@/lib/stores/notes-ui";
import type { NotesView } from "@/types/note";

interface NotesWorkspaceProps {
  view: NotesView;
  autoFocusSearch?: boolean;
  initialTag?: string;
}

export function NotesWorkspace({
  view,
  autoFocusSearch = false,
  initialTag,
}: NotesWorkspaceProps) {
  const prevTagRef = useRef(initialTag);
  const query = useNotesUI((s) => s.query);
  const activeTag = useNotesUI((s) => s.activeTag);

  // Debounce search query for API calls
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (initialTag && initialTag !== prevTagRef.current) {
      useNotesUI.getState().setActiveTag(initialTag);
    }
    prevTagRef.current = initialTag;
  }, [initialTag]);

  // Apply initial tag on mount
  useEffect(() => {
    if (initialTag) {
      useNotesUI.getState().setActiveTag(initialTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notesParams = {
    archived: view === "archived" ? true : false,
    ...(activeTag && !debouncedQuery.trim() ? { tag: activeTag } : {}),
    ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
    limit: 100,
  };

  const { data: notesData, isLoading: notesLoading } = useNotes(notesParams);
  const { data: tagsData } = useTags();

  const notes = notesData?.notes ?? [];
  const allTags = (tagsData ?? []).map((t) => t.name);

  const { isSearching, visibleNotes, selectedNote, heading } = useDerivedNotes(
    notes,
    view,
  );

  const editor = useEditorContent(selectedNote);
  const handlers = useNotesHandlers(selectedNote);

  useKeyboardShortcuts({
    onCreateNote: handlers.handleCreateNote,
    onDeleteNote: () => useNotesUI.getState().setDeleteDialogOpen(true),
    onArchiveNote: () => {
      if (selectedNote) {
        if (selectedNote.isArchived) {
          handlers.handleArchiveToggle(false);
        } else {
          useNotesUI.getState().setArchiveDialogOpen(true);
        }
      }
    },
  });

  const sharedProps = {
    heading,
    isSearching,
    visibleNotes,
    selectedNote,
    content: editor.content,
    handlers,
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        {notesLoading ? (
          <FullPageSpinner />
        ) : (
          <>
            <DesktopLayout
              view={view}
              autoFocusSearch={autoFocusSearch}
              allTags={allTags}
              {...sharedProps}
            />
            <MobileLayout
              view={view}
              autoFocusSearch={autoFocusSearch}
              {...sharedProps}
            />
            <NotesDialogs handlers={handlers} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
