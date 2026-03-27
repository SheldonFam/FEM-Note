"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import { useTipTapEditor } from "./use-tiptap-editor";
import { EditorToolbar } from "./editor-toolbar";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  content: string;
  noteId: string;
  onChange: (md: string) => void;
  className?: string;
}

export function TipTapEditor({
  content,
  noteId,
  onChange,
  className,
}: TipTapEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const editor = useTipTapEditor({
    content,
    onChange,
    noteId,
    editable: mode === "edit",
  });

  if (!editor) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        {mode === "edit" ? (
          <EditorToolbar editor={editor} />
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
          className="ml-2 shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {mode === "edit" ? "Preview" : "Edit"}
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose-editor flex-1"
      />
    </div>
  );
}
