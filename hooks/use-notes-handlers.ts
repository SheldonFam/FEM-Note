import type { Dispatch, SetStateAction } from "react";

import { toDraft } from "@/hooks/use-editor-content";
import { createNote, parseTags } from "@/lib/notes";
import { useNotesUI } from "@/lib/stores/notes-ui";
import { showToast } from "@/components/notes/toast-notification";
import type { Note } from "@/types/note";

export function useNotesHandlers(
  setNotes: Dispatch<SetStateAction<Note[]>>,
  selectedNote: Note | null,
) {
  // --- internal helpers ---

  function store() {
    return useNotesUI.getState();
  }

  function autoSave(updates: Partial<{ title: string; tags: string[]; content: string }>) {
    if (!selectedNote) return;
    const noteId = selectedNote.id;
    setNotes((curr) =>
      curr.map((n) =>
        n.id === noteId
          ? { ...n, ...updates, lastEdited: new Date().toISOString() }
          : n,
      ),
    );
  }

  function ensureDraftStarted() {
    if (!selectedNote) return;
    if (!store().draftNoteId) {
      store().startDraft(selectedNote.id, toDraft(selectedNote));
    }
  }

  // --- public handlers ---

  function handleSelectNote(id: string) {
    const s = store();
    if (id === s.selectedId) return;
    s.clearDraft();
    s.selectNote(id);
    s.setMobileEditorOpen(true);
  }

  function handleCreateNote() {
    const s = store();
    const newNote = createNote();
    setNotes((curr) => [newNote, ...curr]);
    s.setActiveTag(null);
    s.setQuery("");
    s.selectNote(newNote.id);
    s.startDraft(newNote.id, toDraft(newNote));
    s.setMobileEditorOpen(true);
  }

  function handleTagSelect(tag: string | null) {
    const s = store();
    s.clearDraft();
    s.setActiveTag(tag);
  }

  function handleMobileBack() {
    const s = store();
    s.clearDraft();
    s.clearSelection();
  }

  function handleTitleChange(value: string) {
    ensureDraftStarted();
    store().updateDraft({ title: value });
    autoSave({ title: value });
  }

  function handleTagsChange(value: string) {
    ensureDraftStarted();
    store().updateDraft({ tags: value });
    autoSave({ tags: parseTags(value) });
  }

  function handleContentChange(value: string) {
    ensureDraftStarted();
    store().updateDraft({ content: value });
    autoSave({ content: value });
  }

  function handleArchiveToggle(shouldArchive: boolean) {
    if (!selectedNote) return;
    const s = store();

    setNotes((curr) =>
      curr.map((n) =>
        n.id === selectedNote.id
          ? {
              ...n,
              isArchived: shouldArchive,
              lastEdited: new Date().toISOString(),
            }
          : n,
      ),
    );
    s.clearSelection();
    s.setArchiveDialogOpen(false);

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
    if (!selectedNote) return;
    const s = store();

    setNotes((curr) => curr.filter((n) => n.id !== selectedNote.id));
    s.clearSelection();
    s.setDeleteDialogOpen(false);
    showToast("Note permanently deleted.");
  }

  return {
    handleSelectNote,
    handleCreateNote,
    handleTagSelect,
    handleMobileBack,
    handleTitleChange,
    handleTagsChange,
    handleContentChange,
    handleArchiveToggle,
    handleDeleteNote,
  };
}

export type NotesHandlers = ReturnType<typeof useNotesHandlers>;
