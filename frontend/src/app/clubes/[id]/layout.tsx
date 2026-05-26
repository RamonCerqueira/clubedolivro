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
    const res = await fetch(`${apiUrl}/clubs/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error("Club not found");
    const club = await res.json();
    
    return {
      title: `${club.name} | Leituri Club`,
      description: club.description || `Participe do clube de leitura ${club.name} no Leituri e acompanhe as discussões em tempo real.`,
      openGraph: {
        title: `${club.name} | Leituri`,
        description: club.description || `Participe do clube de leitura ${club.name} no Leituri e acompanhe as discussões em tempo real.`,
        images: [
          {
            url: "/logo.png",
            width: 800,
            height: 600,
            alt: club.name,
          }
        ],
      }
    };
  } catch (error) {
    return {
      title: "Clube do Livro | Leituri",
      description: "Conecte-se, debata e gamifique sua jornada literária.",
    };
  }
}

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
