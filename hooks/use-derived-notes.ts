import { useMemo } from "react";

import { useNotesUI } from "@/lib/stores/notes-ui";
import type { Note, NotesView } from "@/types/note";

export function useDerivedNotes(notes: Note[], view: NotesView) {
  const query = useNotesUI((s) => s.query);
  const activeTag = useNotesUI((s) => s.activeTag);
  const selectedId = useNotesUI((s) => s.selectedId);

  const isSearching = query.trim().length > 0;

  // Server already handles filtering; notes array is pre-filtered
  const visibleNotes = notes;

  const selectedNote = useMemo(() => {
    if (!selectedId || !visibleNotes.length) return null;
    return visibleNotes.find((note) => note.id === selectedId) ?? null;
  }, [selectedId, visibleNotes]);

  const heading = isSearching
    ? `Showing results for: ${query.trim()}`
    : activeTag
      ? `Notes Tagged: ${activeTag}`
      : view === "archived"
        ? "Archived Notes"
        : "All Notes";

  return { isSearching, visibleNotes, selectedNote, heading };
}
