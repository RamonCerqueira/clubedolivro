"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, 
  MessageSquare, 
  ArrowLeft, 
  Send, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Sparkles,
  Maximize2,
  Trash2,
  Lock,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { bookService, bookDiscussionService, authService } from "@/services";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookId = params.id as string;

  const [activeTab, setActiveTab] = useState<"DETAILS" | "READER">("DETAILS");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<number | null>(null);
  
  // Discussion form state
  const [discussionContent, setDiscussionContent] = useState("");
  const [discussionChapter, setDiscussionChapter] = useState("");

  // Reader state
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getProfile(),
  });

  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => bookService.getById(bookId),
    enabled: !!bookId,
  });

  const { data: discussions, isLoading: isLoadingDiscussions } = useQuery({
    queryKey: ["discussions", bookId, selectedChapterFilter],
    queryFn: () => bookDiscussionService.getDiscussions(bookId, selectedChapterFilter !== null ? selectedChapterFilter : undefined),
    enabled: !!bookId,
  });

  const createDiscussionMutation = useMutation({
    mutationFn: (payload: { content: string; chapter?: number }) => 
      bookDiscussionService.createDiscussion(bookId, payload),
    onSuccess: () => {
      setDiscussionContent("");
      setDiscussionChapter("");
      queryClient.invalidateQueries({ queryKey: ["discussions", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  const deleteDiscussionMutation = useMutation({
    mutationFn: (discussionId: string) => bookDiscussionService.deleteDiscussion(discussionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionContent.trim()) return;

    createDiscussionMutation.mutate({
      content: discussionContent,
      chapter: discussionChapter ? Number(discussionChapter) : undefined,
    });
  };

  const handlePageTurn = (direction: "NEXT" | "PREV") => {
    setIsFlipped(true);
    setTimeout(() => {
      if (direction === "NEXT") {
        setCurrentPage(prev => Math.min(prev + 2, 10));
      } else {
        setCurrentPage(prev => Math.max(prev - 2, 1));
      }
      setIsFlipped(false);
    }, 300);
  };

  if (isLoadingBook) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Sintonizando Frequência Literária...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Obra não catalogada</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  // Mock contents for flipbook simulation
  const flipbookPages = [
    { num: 1, title: book.title, content: `Obra disponibilizada digitalmente para a comunidade Leituri.\n\nAutor: ${book.author}\n\nInicie suas leituras e debata os capítulos na aba de discussões ao lado.` },
    { num: 2, title: "Capítulo I — Introdução", content: "O despertar do conhecimento ocorre nas frestas das páginas silenciosas. Aqui repousa o início de uma jornada que atravessará séculos de narrativas e descobertas." },
    { num: 3, title: "Análise da Obra", content: "A estrutura dialética proposta pelo autor incita reflexões profundas sobre as conexões humanas na modernidade. Cada frase é cirurgicamente desenhada." },
    { num: 4, title: "Capítulo II — Diálogo", content: "Na vastidão dos encontros cotidianos, percebemos a complexidade de ideias divergentes se chocando. Este capítulo foca no atrito intelectual." },
    { num: 5, title: "Ideia Central", content: "Compartilhar conhecimento não é apenas transferir dados, é expandir horizontes comuns e solidificar a base cultural da nossa sociedade." },
    { num: 6, title: "Capítulo III — Convergência", content: "Quando as vozes se unem em debates virtuais ou presenciais, novos consensos florescem. O livro atua como vetor de fusão coletiva." },
    { num: 7, title: "Crítica Contemporânea", content: "Alguns críticos consideram esta obra inovadora devido ao seu teor humanista intrínseco, que contrasta com a mecanização da nossa era digital." },
    { num: 8, title: "Capítulo IV — Conclusão", content: "Chegando ao ápice da discussão, o leitor é convidado a expandir estes pensamentos fora do papel e aplicá-los em seu dia a dia." },
    { num: 9, title: "Posfácio", content: "Obrigado por utilizar o Leituri PWA Reader. Continue explorando novas obras no acervo global para alimentar sua mente." },
    { num: 10, title: "Notas Finais", content: "Leituri Social App v1.0.0. Todos os direitos reservados. Conexões inteligentes através de páginas reais." }
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/dashboard/books")}
        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Voltar à Biblioteca
      </button>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-[1.5rem] relative overflow-hidden backdrop-blur-3xl">
        <button
          onClick={() => setActiveTab("DETAILS")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.2rem] transition-all relative z-10",
            activeTab === "DETAILS" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Detalhes & Discussões
        </button>
        <button
          onClick={() => setActiveTab("READER")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.2rem] transition-all relative z-10",
            activeTab === "READER" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Leitor de PDF 3D
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "DETAILS" ? (
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Details Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-8 border-white/5 bg-white/2 rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="aspect-[2/3] w-48 mx-auto bg-white/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-zinc-950">📚</div>
                  )}
                </div>

                <div className="text-center mt-8 space-y-2">
                  <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{book.title}</h2>
                  <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">{book.author}</p>
                </div>

                <div className="border-t border-white/5 mt-8 pt-6 space-y-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-2">Categorias</span>
                    <div className="flex flex-wrap gap-1.5">
                      {book.categories?.map((cat: string) => (
                        <span key={cat} className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Sinopse</span>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium italic">
                      "{book.description || "Esta obra de arte aguarda sua primeira resenha coletiva..."}"
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Discussions Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 border-white/5 bg-white/2 rounded-[2.5rem]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-white/5">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="text-secondary" size={20} /> Discussões por Capítulo
                  </h3>
                  
                  {/* Chapter Filter */}
                  <select 
                    value={selectedChapterFilter !== null ? selectedChapterFilter : ""}
                    onChange={(e) => setSelectedChapterFilter(e.target.value ? Number(e.target.value) : null)}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="">Todos os Capítulos</option>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <option key={i} value={i + 1}>Capítulo {i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* Form to Post */}
                <form onSubmit={handlePostDiscussion} className="space-y-4 mb-8 bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex gap-4">
                    <input 
                      type="number" 
                      placeholder="Capítulo (Ex: 3)" 
                      className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-primary/50"
                      value={discussionChapter}
                      onChange={e => setDiscussionChapter(e.target.value)}
                    />
                    <span className="text-[10px] text-neutral-500 font-bold self-center uppercase tracking-widest">Opcional</span>
                  </div>
                  <div className="relative flex items-center">
                    <textarea 
                      placeholder="Compartilhe seu insight brilhante sobre este trecho..." 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white outline-none focus:border-primary/50 transition-all font-bold min-h-[70px] resize-none"
                      value={discussionContent}
                      onChange={e => setDiscussionContent(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      disabled={!discussionContent.trim() || createDiscussionMutation.isPending}
                      className="absolute right-3 w-10 h-10 rounded-full bg-primary text-white p-0 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </form>

                {/* Discussions Timeline */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {isLoadingDiscussions ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : !discussions || discussions.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">Nenhuma discussão iniciada neste capítulo.</p>
                    </div>
                  ) : (
                    discussions.map((disc: any) => (
                      <div key={disc.id} className="flex gap-4 bg-white/1 p-4 rounded-3xl border border-white/5 relative group/comment">
                        <Avatar user={disc.author} className="w-10 h-10 border border-white/10 shrink-0" />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-white uppercase tracking-tight">{disc.author.username}</p>
                              {disc.chapter && (
                                <span className="text-[8px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">Cap. {disc.chapter}</span>
                              )}
                            </div>
                            <span className="text-[9px] text-neutral-600 font-bold flex items-center gap-1">
                              <Clock size={10} /> {new Date(disc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-2 leading-relaxed font-medium">{disc.content}</p>
                        </div>

                        {disc.authorId === me?.id && (
                          <button
                            onClick={() => deleteDiscussionMutation.mutate(disc.id)}
                            className="absolute right-4 bottom-4 opacity-0 group-hover/comment:opacity-100 text-neutral-600 hover:text-rose-500 p-1.5 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-8 py-8"
          >
            {/* Flipbook Container */}
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-zinc-950/60 rounded-[3rem] border border-white/5 p-8 flex items-center justify-center shadow-3xl backdrop-blur-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              
              {/* 3D Simulation Flipbook */}
              <div className="w-full h-full flex relative overflow-hidden rounded-2xl shadow-inner border border-white/5 bg-[#161619] shadow-2xl">
                
                {/* Left Page */}
                <div className="flex-1 h-full p-8 md:p-12 bg-zinc-900 border-r border-black/40 flex flex-col justify-between relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/30 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">PÁGINA {currentPage}</span>
                    <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">{flipbookPages[currentPage - 1]?.title}</h4>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-medium whitespace-pre-line mt-4">
                      {flipbookPages[currentPage - 1]?.content}
                    </p>
                  </div>
                  
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{currentPage}</span>
                </div>

                {/* Right Page */}
                <div className="flex-1 h-full p-8 md:p-12 bg-zinc-900 flex flex-col justify-between relative">
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/30 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary leading-none">PÁGINA {currentPage + 1}</span>
                    <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">{flipbookPages[currentPage]?.title}</h4>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-medium whitespace-pre-line mt-4">
                      {flipbookPages[currentPage]?.content}
                    </p>
                  </div>
                  
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{currentPage + 1}</span>
                </div>

                {/* Page turn shadow animation */}
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div 
                      initial={{ scaleX: 1, originX: 0 }}
                      animate={{ scaleX: [1, 0, 1], originX: [0, 0.5, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 w-1/2 h-full bg-zinc-800 shadow-2xl border-l border-black/25 z-30"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Reader Controls */}
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-8 py-4 rounded-full shadow-xl">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handlePageTurn("PREV")}
                disabled={currentPage <= 1}
                className="w-12 h-12 rounded-full text-neutral-400 hover:text-white"
              >
                <ChevronLeft size={24} />
              </Button>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Pág. {currentPage} - {currentPage + 1} de 10
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handlePageTurn("NEXT")}
                disabled={currentPage >= 9}
                className="w-12 h-12 rounded-full text-neutral-400 hover:text-white"
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
