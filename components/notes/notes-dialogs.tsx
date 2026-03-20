import { FileArchive, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/notes/confirm-dialog";
import type { NotesHandlers } from "@/hooks/use-notes-handlers";
import { useNotesUI } from "@/lib/stores/notes-ui";

interface NotesDialogsProps {
  handlers: NotesHandlers;
}

export function NotesDialogs({ handlers }: NotesDialogsProps) {
  const archiveDialogOpen = useNotesUI((s) => s.archiveDialogOpen);
  const setArchiveDialogOpen = useNotesUI((s) => s.setArchiveDialogOpen);
  const deleteDialogOpen = useNotesUI((s) => s.deleteDialogOpen);
  const setDeleteDialogOpen = useNotesUI((s) => s.setDeleteDialogOpen);

  return (
    <>
      <ConfirmDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        icon={FileArchive}
        title="Archive Note"
        description="Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime."
        confirmLabel="Archive Note"
        onConfirm={() => handlers.handleArchiveToggle(true)}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        icon={Trash2}
        title="Delete Note"
        description="Are you sure you want to permanently delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        confirmVariant="destructive"
        onConfirm={handlers.handleDeleteNote}
      />
    </>
  );
}
