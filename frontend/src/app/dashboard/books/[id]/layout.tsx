import type { Metadata } from "next";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/books/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Book not found");
    const book = await res.json();
    
    return {
      title: `${book.title} - ${book.author} | Leituri Library`,
      description: book.description || `Veja resenhas, discussões de capítulos e leia ${book.title} de ${book.author} no Leituri.`,
      openGraph: {
        title: `${book.title} | Leituri`,
        description: book.description || `Veja resenhas, discussões de capítulos e leia ${book.title} de ${book.author} no Leituri.`,
        images: book.cover ? [
          {
            url: book.cover,
            width: 800,
            height: 600,
            alt: book.title,
          }
        ] : [
          {
            url: "/logo.png",
            width: 800,
            height: 600,
            alt: book.title,
          }
        ],
      }
    };
  } catch (error) {
    return {
      title: "Livro | Leituri Library",
      description: "Explore nossa biblioteca de clássicos, resenhas e discussões interativas.",
    };
  }
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
