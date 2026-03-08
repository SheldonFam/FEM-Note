import { Archive, Clock3, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNoteDate } from "@/lib/notes";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";

interface NoteDraft {
  title: string;
  tags: string;
  content: string;
}

interface NoteEditorProps {
  note: Note;
  draft: NoteDraft;
  isDirty: boolean;
  validationError: string | null;
  onTitleChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function NoteEditor({
  note,
  draft,
  isDirty,
  validationError,
  onTitleChange,
  onTagsChange,
  onContentChange,
  onSave,
  onCancel,
}: NoteEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <Input
        aria-label="Note title"
        value={draft.title}
        onChange={(event) => onTitleChange(event.target.value)}
        className={cn(
          "mb-1 h-auto border-none bg-transparent px-0 text-4xl font-bold tracking-tight shadow-none focus-visible:ring-0",
          validationError && "text-destructive"
        )}
        placeholder="Enter a title..."
      />
      {validationError ? (
        <p className="mb-4 text-sm text-destructive">{validationError}</p>
      ) : (
        <div className="mb-4" />
      )}

      <div className="grid gap-3 text-sm text-muted-foreground lg:max-w-xl">
        <div className="grid gap-2 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center">
          <span className="flex items-center gap-2">
            <Tag className="size-4" />
            Tags
          </span>
          <Input
            aria-label="Note tags"
            value={draft.tags}
            onChange={(event) => onTagsChange(event.target.value)}
            className="h-auto border-none bg-transparent px-0 text-sm text-foreground shadow-none focus-visible:ring-0"
            placeholder="Add tags separated by commas"
          />
        </div>

        {note.isArchived ? (
          <div className="grid gap-2 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center">
            <span className="flex items-center gap-2">
              <Archive className="size-4" />
              Status
            </span>
            <span className="text-foreground">Archived</span>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center">
          <span className="flex items-center gap-2">
            <Clock3 className="size-4" />
            Last edited
          </span>
          <span className="text-foreground">
            {formatNoteDate(note.lastEdited)}
          </span>
        </div>
      </div>

      <Separator className="my-5" />

      <Textarea
        aria-label="Note content"
        value={draft.content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="Start typing your note here..."
        className="min-h-[360px] flex-1 resize-none border-none bg-transparent px-0 py-0 text-base leading-7 shadow-none focus-visible:ring-0"
      />

      <div className="mt-6 flex items-center gap-3">
        <Button type="button" onClick={onSave} disabled={!isDirty}>
          Save Note
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={!isDirty}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function NoteEditorEmpty() {
  return (
    <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-border bg-card px-8 text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold">Select a note</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Choose a note from the list to review or edit it. New notes will
          appear at the top of the list.
        </p>
      </div>
    </div>
  );
}
