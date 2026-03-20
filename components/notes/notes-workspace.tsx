"use client";

import { useEffect, useRef, useState } from "react";

import { DesktopLayout } from "@/components/notes/desktop-layout";
import { MobileLayout } from "@/components/notes/mobile-layout";
import { NotesDialogs } from "@/components/notes/notes-dialogs";
import { useDerivedNotes } from "@/hooks/use-derived-notes";
import { useEditorContent } from "@/hooks/use-editor-content";
import { useNotesHandlers } from "@/hooks/use-notes-handlers";
import { useNotesUI } from "@/lib/stores/notes-ui";
import type { Note, NotesView } from "@/types/note";

interface NotesWorkspaceProps {
  initialNotes: Note[];
  view: NotesView;
  autoFocusSearch?: boolean;
  initialTag?: string;
}

export function NotesWorkspace({
  initialNotes,
  view,
  autoFocusSearch = false,
  initialTag,
}: NotesWorkspaceProps) {
  const [notes, setNotes] = useState(initialNotes);
  const tagApplied = useRef(false);

  useEffect(() => {
    if (initialTag && !tagApplied.current) {
      useNotesUI.getState().setActiveTag(initialTag);
      tagApplied.current = true;
    }
  }, [initialTag]);

  const { allTags, isSearching, visibleNotes, selectedNote, heading } =
    useDerivedNotes(notes, view);

  const editor = useEditorContent(selectedNote);
  const handlers = useNotesHandlers(setNotes, selectedNote);

  const sharedProps = {
    heading,
    isSearching,
    visibleNotes,
    selectedNote,
    content: editor.content,
    handlers,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesktopLayout
        view={view}
        autoFocusSearch={autoFocusSearch}
        allTags={allTags}
        {...sharedProps}
      />
      <MobileLayout view={view} autoFocusSearch={autoFocusSearch} {...sharedProps} />
      <NotesDialogs handlers={handlers} />
    </div>
  );
}
