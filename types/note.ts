export interface Note {
  id: string;
  title: string;
  tags: string[];
  content: string;
  lastEdited: string;
  isArchived: boolean;
}

export type NotesView = "all" | "archived";

export interface ApiTag {
  id: string;
  name: string;
  noteCount: number;
}

export interface ApiNote {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  tags: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiNotesResponse {
  data: ApiNote[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
