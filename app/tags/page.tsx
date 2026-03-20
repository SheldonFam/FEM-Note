import { TagsListView } from "@/components/notes/tags-list-view";
import { seededNotes } from "@/lib/notes";

export default function TagsPage() {
  return <TagsListView initialNotes={seededNotes} />;
}
