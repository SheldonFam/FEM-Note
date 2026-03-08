import rawNotes from "@/data.json";
import type { Note, NotesView } from "@/types/note";

function createNoteId(title: string, index: number) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
}

function normalizeNote(note: Omit<Note, "id">, index: number): Note {
  return {
    ...note,
    id: createNoteId(note.title, index),
  };
}

export const seededNotes: Note[] = rawNotes.notes
  .map((note, index) => normalizeNote(note, index))
  .sort((left, right) => {
    return (
      new Date(right.lastEdited).getTime() - new Date(left.lastEdited).getTime()
    );
  });

export function getNotesForView(notes: Note[], view: NotesView) {
  const shouldBeArchived = view === "archived";

  return notes.filter((note) => note.isArchived === shouldBeArchived);
}

export function collectAllTags(notes: Note[]) {
  return [...new Set(notes.flatMap((note) => note.tags))].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function matchesQuery(note: Note, query: string) {
  if (!query.trim()) {
    return true;
  }

  const searchableValue = [note.title, note.content, note.tags.join(" ")]
    .join(" ")
    .toLowerCase();

  return searchableValue.includes(query.trim().toLowerCase());
}

export function formatNoteDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createDraftNote(): Note {
  const now = new Date().toISOString();

  return {
    id: `draft-${now}`,
    title: "Untitled Note",
    tags: [],
    content: "",
    lastEdited: now,
    isArchived: false,
  };
}
