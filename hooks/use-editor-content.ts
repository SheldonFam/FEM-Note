import { useMemo } from "react";

import {
  emptyDraft,
  useNotesUI,
  type NoteDraft,
} from "@/lib/stores/notes-ui";
import { parseTags } from "@/lib/notes";
import type { Note } from "@/types/note";

export function toDraft(note: Note): NoteDraft {
  return {
    title: note.title,
    tags: note.tags.join(", "),
    content: note.content,
  };
}

export function useEditorContent(selectedNote: Note | null) {
  const draftNoteId = useNotesUI((s) => s.draftNoteId);
  const draft = useNotesUI((s) => s.draft);

  const hasDraft = selectedNote !== null && draftNoteId === selectedNote.id;

  const content = hasDraft
    ? draft
    : selectedNote
      ? toDraft(selectedNote)
      : emptyDraft;

  const parsedTags = useMemo(() => parseTags(content.tags), [content.tags]);

  return { content, parsedTags };
}
