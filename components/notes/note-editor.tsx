import { Archive, Clock3, Tag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNoteDate } from "@/lib/notes";
import type { NoteDraft } from "@/lib/stores/notes-ui";
import type { Note } from "@/types/note";

interface NoteEditorProps {
  note: Note;
  draft: NoteDraft;
  onTitleChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onTagsBlur: () => void;
  onContentChange: (value: string) => void;
}

export function NoteEditor({
  note,
  draft,
  onTitleChange,
  onTagsChange,
  onTagsBlur,
  onContentChange,
}: NoteEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <Input
        aria-label="Note title"
        value={draft.title}
        onChange={(event) => onTitleChange(event.target.value)}
        className="mb-1 h-auto border-none bg-transparent px-0 text-2xl font-bold tracking-tight shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:font-bold placeholder:text-2xl placeholder:text-[#0E121B]"
        placeholder="Enter a title..."
      />
      <div className="mb-4" />

      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3 text-sm text-muted-foreground lg:max-w-xl">
        <span className="flex items-center gap-2">
          <Tag className="size-4" />
          Tags
        </span>
        <Input
          aria-label="Note tags"
          value={draft.tags}
          onChange={(event) => onTagsChange(event.target.value)}
          onBlur={onTagsBlur}
          className="h-auto border-none bg-transparent px-0 text-sm text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Add tags separated by commas"
        />

        {note.isArchived ? (
          <>
            <span className="flex items-center gap-2">
              <Archive className="size-4" />
              Status
            </span>
            <span className="text-foreground">Archived</span>
          </>
        ) : null}

        <span className="flex items-center gap-2">
          <Clock3 className="size-4" />
          Last edited
        </span>
        <span className="text-foreground">
          {formatNoteDate(note.lastEdited)}
        </span>
      </div>

      <Separator className="my-5" />

      <Textarea
        aria-label="Note content"
        value={draft.content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="Start typing your note here..."
        className="min-h-[360px] flex-1 resize-none border-none bg-transparent px-0 py-0 text-base leading-7 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
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
