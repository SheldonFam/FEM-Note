import type { Note, ApiNote } from "@/types/note";

export function mapApiNote(apiNote: ApiNote): Note {
  return {
    id: apiNote.id,
    title: apiNote.title,
    tags: apiNote.tags.map((t) => t.name),
    content: apiNote.content,
    lastEdited: apiNote.updatedAt,
    isArchived: apiNote.isArchived,
  };
}
