"use client";

import { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface UseTipTapEditorOptions {
  content: string;
  onChange: (md: string) => void;
  noteId: string;
  editable?: boolean;
}

export function useTipTapEditor({
  content,
  onChange,
  noteId,
  editable = true,
}: UseTipTapEditorOptions) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Markdown.configure({
        transformPastedText: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing your note here...",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown.getMarkdown() as string;
      onChange(md);
    },
  });

  // Sync content when switching notes (NOT on every content change)
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, editor]);

  // Sync editable state
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return editor;
}
