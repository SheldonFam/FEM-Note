"use client";

import { useEffect, useRef } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { DesktopLayout } from "@/components/notes/desktop-layout";
import { MobileLayout } from "@/components/notes/mobile-layout";
import { NotesDialogs } from "@/components/notes/notes-dialogs";
import { useDerivedNotes } from "@/hooks/use-derived-notes";
import { useEditorContent } from "@/hooks/use-editor-content";
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
  const tagApplied = useRef(false);
  const query = useNotesUI((s) => s.query);
  const activeTag = useNotesUI((s) => s.activeTag);

  useEffect(() => {
    if (initialTag && !tagApplied.current) {
      useNotesUI.getState().setActiveTag(initialTag);
      tagApplied.current = true;
    }
  }, [initialTag]);

  const notesParams = {
    archived: view === "archived" ? true : false,
    ...(activeTag && !query.trim() ? { tag: activeTag } : {}),
    ...(query.trim() ? { q: query.trim() } : {}),
    limit: 100,
  };

  const { data: notesData, isLoading: notesLoading, isFetching } = useNotes(notesParams);
  const { data: tagsData } = useTags();

  const notes = notesData?.notes ?? [];
  const allTags = (tagsData ?? []).map((t) => t.name);

  const { isSearching, visibleNotes, selectedNote, heading } =
    useDerivedNotes(notes, view);

  const editor = useEditorContent(selectedNote);
  const handlers = useNotesHandlers(selectedNote);

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
          <div className="flex min-h-screen items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : (
          <>
            <DesktopLayout
              view={view}
              autoFocusSearch={autoFocusSearch}
              allTags={allTags}
              {...sharedProps}
            />
            <MobileLayout view={view} autoFocusSearch={autoFocusSearch} {...sharedProps} />
            <NotesDialogs handlers={handlers} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
