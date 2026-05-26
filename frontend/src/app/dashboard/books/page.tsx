"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Loader2,
  Bookmark
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { bookService } from "@/services";

export default function BooksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books", search],
    queryFn: () => search ? bookService.search(search) : bookService.getAll(),
  });

  const { data: recommendations, isLoading: isLoadingRecs } = useQuery({
    queryKey: ["book-recommendations"],
    queryFn: () => bookService.getRecommendations(),
  });

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Biblioteca Digital</h1>
          <p className="text-neutral-500 font-medium">Explore obras literárias, participe de discussões e abra PDFs interativos.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Buscar livros por título, autor ou categoria..." 
          className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-white placeholder:text-neutral-600 font-bold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Recommendations Section */}
      {!search && recommendations && recommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-yellow-500 animate-pulse" size={22} /> Recomendados para Você
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.slice(0, 2).map((book: any) => (
              <Card 
                key={book.id}
                onClick={() => router.push(`/dashboard/books/${book.id}`)}
                className="p-6 border-white/5 bg-gradient-to-r from-primary/10 via-white/2 to-transparent hover:border-primary/30 transition-all duration-500 flex gap-6 cursor-pointer group rounded-[2rem] overflow-hidden"
              >
                <div className="w-24 aspect-[2/3] bg-white/5 rounded-xl overflow-hidden shadow-xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-500">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-zinc-900">📚</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {book.categories?.slice(0, 2).map((cat: string) => (
                      <span key={cat} className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">{cat}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-black text-white truncate leading-snug group-hover:text-primary transition-colors uppercase tracking-tight">{book.title}</h3>
                  <p className="text-xs text-neutral-400 font-bold mt-1 uppercase tracking-wider">{book.author}</p>
                  <p className="text-xs text-neutral-500 mt-3 line-clamp-2 italic leading-relaxed font-medium">"{book.description || "Esta obra ainda não possui sinopse descrita..."}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: All Books */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="text-secondary" size={22} /> Acervo Literário
        </h2>

        {isLoadingBooks ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-xs text-neutral-500 font-black uppercase tracking-widest">Indexando Biblioteca...</p>
          </div>
        ) : books?.length === 0 ? (
          <div className="text-center py-20 bg-white/2 rounded-[2.5rem] border-2 border-dashed border-white/5 opacity-40">
            <BookOpen className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Nenhum livro cadastrado na estante global.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book: any) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -6 }}
                onClick={() => router.push(`/dashboard/books/${book.id}`)}
                className="flex flex-col group cursor-pointer"
              >
                <div className="aspect-[2/3] bg-white/2 border border-white/5 rounded-[2rem] shadow-xl overflow-hidden flex items-center justify-center relative hover:border-primary/40 transition-all duration-500">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-neutral-600">
                      <BookOpen size={36} />
                      <span className="text-[9px] font-black uppercase tracking-widest mt-2">Leituri</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Abrir Obra</span>
                    <p className="text-xs font-black text-white line-clamp-2 uppercase tracking-tight leading-tight">{book.title}</p>
                    <p className="text-[9px] text-zinc-400 mt-1 font-bold truncate max-w-full">{book.author}</p>
                  </div>
                </div>
                <h4 className="text-xs font-black text-white mt-3 text-center uppercase tracking-tight truncate group-hover:text-primary transition-colors">{book.title}</h4>
                <p className="text-[10px] text-neutral-500 font-bold text-center mt-0.5">{book.author}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
