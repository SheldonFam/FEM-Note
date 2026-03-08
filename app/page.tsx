import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { seededNotes } from "@/lib/notes";

export default function Home() {
  return <NotesWorkspace initialNotes={seededNotes} view="all" />;
}
