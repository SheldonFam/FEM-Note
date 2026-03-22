"use client";

import { useEffect } from "react";
import { useNotesUI } from "@/lib/stores/notes-ui";

interface KeyboardShortcutsOptions {
  onCreateNote: () => void;
  onDeleteNote: () => void;
  onArchiveNote: () => void;
  searchInputId?: string;
}

export function useKeyboardShortcuts({
  onCreateNote,
  onDeleteNote,
  onArchiveNote,
  searchInputId = "notes-search",
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Escape — deselect note / close mobile editor
      if (e.key === "Escape") {
        const s = useNotesUI.getState();
        if (s.archiveDialogOpen || s.deleteDialogOpen) return;
        s.clearDraft();
        s.clearSelection();
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      if (isInput) return;

      const mod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd + N — create new note
      if (mod && e.key === "n") {
        e.preventDefault();
        onCreateNote();
        return;
      }

      // Ctrl/Cmd + / — focus search
      if (mod && e.key === "/") {
        e.preventDefault();
        const searchInput = document.getElementById(searchInputId);
        if (searchInput) searchInput.focus();
        return;
      }

      // Delete/Backspace — delete selected note
      if (e.key === "Delete" || e.key === "Backspace") {
        const s = useNotesUI.getState();
        if (s.selectedId) {
          e.preventDefault();
          onDeleteNote();
        }
        return;
      }

      // e — archive/unarchive selected note
      if (e.key === "e") {
        const s = useNotesUI.getState();
        if (s.selectedId) {
          e.preventDefault();
          onArchiveNote();
        }
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCreateNote, onDeleteNote, onArchiveNote, searchInputId]);
}
