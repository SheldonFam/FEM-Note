import { useMemo } from "react";

import { useNotesUI } from "@/lib/stores/notes-ui";
import { collectAllTags, matchesQuery } from "@/lib/notes";
import type { Note, NotesView } from "@/types/note";

export function useDerivedNotes(notes: Note[], view: NotesView) {
  const query = useNotesUI((s) => s.query);
  const activeTag = useNotesUI((s) => s.activeTag);
  const selectedId = useNotesUI((s) => s.selectedId);

  const allTags = useMemo(() => collectAllTags(notes), [notes]);
  const isSearching = query.trim().length > 0;

  const visibleNotes = useMemo(() => {
    const shouldBeArchived = view === "archived";
    const viewFiltered = notes.filter(
      (note) => note.isArchived === shouldBeArchived,
    );

    if (isSearching) {
      return viewFiltered.filter((note) => matchesQuery(note, query));
    }

    return viewFiltered.filter((note) =>
      activeTag ? note.tags.includes(activeTag) : true,
    );
  }, [activeTag, isSearching, notes, query, view]);

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

  return { allTags, isSearching, visibleNotes, selectedNote, heading };
}
