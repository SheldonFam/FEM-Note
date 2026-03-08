import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { seededNotes } from "@/lib/notes";

export default function ArchivedPage() {
  return <NotesWorkspace initialNotes={seededNotes} view="archived" />;
}
