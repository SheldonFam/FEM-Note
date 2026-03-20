import { create } from "zustand";

export interface NoteDraft {
  title: string;
  tags: string;
  content: string;
}

export const emptyDraft: NoteDraft = {
  title: "",
  tags: "",
  content: "",
};

interface NotesUIState {
  // navigation
  query: string;
  activeTag: string | null;
  selectedId: string | null;
  mobileEditorOpen: boolean;

  // draft — raw data for controlled inputs
  draftNoteId: string | null;
  draft: NoteDraft;

  // dialogs
  archiveDialogOpen: boolean;
  deleteDialogOpen: boolean;
}

interface NotesUIActions {
  // navigation
  setQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  selectNote: (id: string) => void;
  clearSelection: () => void;
  setMobileEditorOpen: (open: boolean) => void;

  // draft
  startDraft: (noteId: string, initial: NoteDraft) => void;
  updateDraft: (partial: Partial<NoteDraft>) => void;
  clearDraft: () => void;

  // dialogs
  setArchiveDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
}

export type NotesUIStore = NotesUIState & NotesUIActions;

export const useNotesUI = create<NotesUIStore>((set) => ({
  // --- initial state ---
  query: "",
  activeTag: null,
  selectedId: null,
  mobileEditorOpen: false,

  draftNoteId: null,
  draft: emptyDraft,

  archiveDialogOpen: false,
  deleteDialogOpen: false,

  // --- navigation actions ---
  setQuery: (q) => set({ query: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  selectNote: (id) => set({ selectedId: id }),
  clearSelection: () =>
    set({
      selectedId: null,
      mobileEditorOpen: false,
      draftNoteId: null,
      draft: emptyDraft,
    }),
  setMobileEditorOpen: (open) => set({ mobileEditorOpen: open }),

  // --- draft actions ---
  startDraft: (noteId, initial) =>
    set({
      draftNoteId: noteId,
      draft: initial,
    }),
  updateDraft: (partial) =>
    set((state) => ({
      draft: { ...state.draft, ...partial },
    })),
  clearDraft: () =>
    set({
      draftNoteId: null,
      draft: emptyDraft,
    }),

  // --- dialog actions ---
  setArchiveDialogOpen: (open) => set({ archiveDialogOpen: open }),
  setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
}));
