import { toDraft } from "@/hooks/use-editor-content";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useCreateNote } from "@/hooks/use-notes-mutations";
import { useDeleteNote, useArchiveNote, useRestoreNote } from "@/hooks/use-notes-mutations";
import { parseTags } from "@/lib/notes";
import { useNotesUI } from "@/lib/stores/notes-ui";
import { showToast } from "@/components/notes/toast-notification";
import type { Note } from "@/types/note";

export function useNotesHandlers(selectedNote: Note | null) {
  const createNoteMutation = useCreateNote();
  const deleteNoteMutation = useDeleteNote();
  const archiveNoteMutation = useArchiveNote();
  const restoreNoteMutation = useRestoreNote();
  const debouncedSave = useDebouncedSave();

  function store() {
    return useNotesUI.getState();
  }

  function ensureDraftStarted() {
    if (!selectedNote) return;
    if (!store().draftNoteId) {
      store().startDraft(selectedNote.id, toDraft(selectedNote));
    }
  }

  function flushPendingTags() {
    if (!selectedNote) return;
    const draft = store().draft;
    if (store().draftNoteId === selectedNote.id) {
      const tags = parseTags(draft.tags);
      if (tags.join(",") !== selectedNote.tags.join(",")) {
        debouncedSave.save(selectedNote.id, { tags });
      }
    }
  }

  function handleSelectNote(id: string) {
    const s = store();
    if (id === s.selectedId) return;
    flushPendingTags();
    debouncedSave.flush();
    s.clearDraft();
    s.selectNote(id);
    s.setMobileEditorOpen(true);
  }

  async function handleCreateNote() {
    const s = store();
    try {
      const apiNote = await createNoteMutation.mutateAsync({
        title: "",
        content: "",
        tags: [],
      });
      s.setActiveTag(null);
      s.setQuery("");
      s.selectNote(apiNote.id);
      s.startDraft(apiNote.id, { title: "", tags: "", content: "" });
      s.setMobileEditorOpen(true);
    } catch {
      showToast("Failed to create note.");
    }
  }

  function handleTagSelect(tag: string | null) {
    const s = store();
    flushPendingTags();
    debouncedSave.flush();
    s.clearDraft();
    s.setActiveTag(tag);
  }

  function handleMobileBack() {
    const s = store();
    flushPendingTags();
    debouncedSave.flush();
    s.clearDraft();
    s.clearSelection();
  }

  function handleTitleChange(value: string) {
    if (!selectedNote) return;
    ensureDraftStarted();
    store().updateDraft({ title: value });
    debouncedSave.save(selectedNote.id, { title: value });
  }

  function handleTagsChange(value: string) {
    if (!selectedNote) return;
    ensureDraftStarted();
    store().updateDraft({ tags: value });
  }

  function handleTagsBlur() {
    if (!selectedNote) return;
    const tags = parseTags(store().draft.tags);
    debouncedSave.save(selectedNote.id, { tags });
  }

  function handleContentChange(value: string) {
    if (!selectedNote) return;
    ensureDraftStarted();
    store().updateDraft({ content: value });
    debouncedSave.save(selectedNote.id, { content: value });
  }

  async function handleArchiveToggle(shouldArchive: boolean) {
    if (!selectedNote) return;
    const s = store();
    debouncedSave.cancel();

    try {
      if (shouldArchive) {
        await archiveNoteMutation.mutateAsync(selectedNote.id);
        showToast("Note archived.", {
          linkLabel: "Archived Notes",
          linkHref: "/archived",
        });
      } else {
        await restoreNoteMutation.mutateAsync(selectedNote.id);
        showToast("Note restored to active notes.", {
          linkLabel: "All Notes",
          linkHref: "/",
        });
      }
    } catch {
      showToast("Failed to update note.");
    }

    s.clearSelection();
    s.setArchiveDialogOpen(false);
  }

  async function handleDeleteNote() {
    if (!selectedNote) return;
    const s = store();
    debouncedSave.cancel();

    try {
      await deleteNoteMutation.mutateAsync(selectedNote.id);
      showToast("Note permanently deleted.");
    } catch {
      showToast("Failed to delete note.");
    }

    s.clearSelection();
    s.setDeleteDialogOpen(false);
  }

  return {
    handleSelectNote,
    handleCreateNote,
    handleTagSelect,
    handleMobileBack,
    handleTitleChange,
    handleTagsChange,
    handleTagsBlur,
    handleContentChange,
    handleArchiveToggle,
    handleDeleteNote,
  };
}

export type NotesHandlers = ReturnType<typeof useNotesHandlers>;
