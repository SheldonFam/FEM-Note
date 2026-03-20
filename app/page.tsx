import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { seededNotes } from "@/lib/notes";

interface HomeProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag } = await searchParams;
  return (
    <NotesWorkspace
      initialNotes={seededNotes}
      view="all"
      initialTag={tag}
    />
  );
}
