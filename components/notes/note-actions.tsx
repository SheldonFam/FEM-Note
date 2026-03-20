import { Archive, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Note } from "@/types/note";

interface NoteActionsProps {
  note: Note | null;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function NoteActions({
  note,
  onArchive,
  onRestore,
  onDelete,
}: NoteActionsProps) {
  return (
    <aside className="hidden px-6 py-5 lg:px-6 xl:block">
      <div className="space-y-3">
        {note?.isArchived ? (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={onRestore}
            disabled={!note}
          >
            <Undo2 className="size-4" />
            Restore Note
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={onArchive}
            disabled={!note}
          >
            <Archive className="size-4" />
            Archive Note
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={onDelete}
          disabled={!note}
        >
          <Trash2 className="size-4" />
          Delete Note
        </Button>
      </div>
    </aside>
  );
}
