import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { seededNotes } from "@/lib/notes";

export default function SearchPage() {
  return <NotesWorkspace initialNotes={seededNotes} view="all" autoFocusSearch />;
}
