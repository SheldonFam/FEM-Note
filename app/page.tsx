import { NotesWorkspace } from "@/components/notes/notes-workspace";

interface HomeProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag } = await searchParams;
  return (
    <NotesWorkspace
      view="all"
      initialTag={tag}
    />
  );
}
