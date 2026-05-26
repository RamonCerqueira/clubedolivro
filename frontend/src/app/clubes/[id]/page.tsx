"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Share2, 
  Send, 
  Search,
  MoreVertical,
  Plus,
  Loader2,
  Calendar,
  MapPin,
  Target,
  CalendarDays,
  Award,
  Mic,
  BookOpen,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useParams } from "next/navigation";
import { clubService, goalService, bookService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { AudioRooms } from "@/components/features/AudioRooms";

const COVERS = [
  "/club_cover.png",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop"
];

const getCover = (id: string) => {
  const charCode = (id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  return COVERS[charCode % COVERS.length];
};

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const { messages, sendMessage, isConnected } = useChat(clubId);
  const [activeTab, setActiveTab] = useState("feed");
  const [chatMsg, setChatMsg] = useState("");
  const [postText, setPostText] = useState("");

  // Estados de áudio para posts
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  // Estados para as Metas Coletivas
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalEndDate, setNewGoalEndDate] = useState("");
  const [contribGoalId, setContribGoalId] = useState<string | null>(null);
  const [contribPages, setContribPages] = useState("");

  // Estados e queries para Livro Atual
  const [showSelectBook, setShowSelectBook] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books", bookSearchQuery],
    queryFn: () => bookService.getAll(bookSearchQuery ? { search: bookSearchQuery } : undefined),
    enabled: showSelectBook
  });

  const setCurrentBookMutation = useMutation({
    mutationFn: (bookId: string | null) => clubService.setCurrentBook(clubId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      setShowSelectBook(false);
    }
  });

  const { data: club, isLoading: isLoadingClub, error: clubError } = useQuery({
    queryKey: ["club", clubId],
    queryFn: () => clubService.getById(clubId),
    enabled: !!clubId
  });

  const { data: feed, isLoading: isLoadingFeed } = useQuery({
    queryKey: ["clubFeed", clubId],
    queryFn: () => clubService.getFeed(clubId),
    enabled: !!clubId
  });

  // Metas Coletivas
  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: ["clubGoals", clubId],
    queryFn: () => goalService.getByClub(clubId),
    enabled: !!clubId
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: { title: string; targetPages: number; endDate: string }) => 
      goalService.create(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubGoals", clubId] });
      setShowAddGoal(false);
      setNewGoalTitle("");
      setNewGoalTarget("");
      setNewGoalEndDate("");
    }
  });

  const addProgressMutation = useMutation({
    mutationFn: ({ goalId, pages }: { goalId: string; pages: number }) => 
      goalService.addProgress(clubId, goalId, pages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubGoals", clubId] });
      setContribGoalId(null);
      setContribPages("");
    }
  });

  const createPostMutation = useMutation({
    mutationFn: ({ content, audioUrl }: { content: string; audioUrl?: string }) => 
      clubService.createPost(content, clubId, audioUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubFeed", clubId] });
      setPostText("");
      setAudioBase64(null);
      setShowRecorder(false);
    }
  });

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    sendMessage(chatMsg);
    setChatMsg("");
  };

  const handlePostDiscussion = () => {
    if (!postText.trim() || createPostMutation.isPending) return;
    createPostMutation.mutate({ content: postText, audioUrl: audioBase64 || undefined });
  };

  if (isLoadingClub) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Acessando QG do Clube...</p>
      </div>
    );
  }

  if (clubError || !club) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <h2 className="text-3xl font-display font-bold">Clube não encontrado</h2>
        <p className="text-neutral-500">Este clube não existe ou você não tem permissão para visualizá-lo.</p>
        <a href="/explorar">
          <Button className="bg-primary font-black rounded-xl">Voltar para a Exploração</Button>
        </a>
      </div>
    );
  }

  const cover = getCover(club.id);
  const membersCount = club._count?.members || club.members?.length || 0;
  const discussionsCount = club._count?.posts || feed?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* Club Header */}
      <div className="relative h-64 rounded-3xl overflow-hidden group">
        <img src={cover} alt={club.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/10 shrink-0">
              {club.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{club.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-300">
                <span className="flex items-center gap-1.5"><Users size={16} className="text-primary" /> {membersCount} {membersCount === 1 ? 'membro' : 'membros'}</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={16} className="text-secondary" /> {discussionsCount} {discussionsCount === 1 ? 'discussão ativa' : 'discussões ativas'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="ghost" className="rounded-xl glass text-white"><Share2 size={18} /></Button>
            <Button variant="ghost" className="rounded-xl glass text-white"><Settings size={18} /></Button>
            <Button className="rounded-xl bg-white text-black font-black hover:bg-neutral-200">Participando</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAIN AREA */}
        <div className="lg:col-span-8 space-y-6">

            {/* CARD LIVRO ATUAL */}
            <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-secondary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-all duration-700" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-secondary w-5 h-5" />
                  <h3 className="font-display font-bold text-white text-lg">Livro em Leitura Coletiva</h3>
                </div>
                {club.creatorId === user?.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSelectBook(true)}
                    className="text-secondary hover:text-secondary/80 font-bold uppercase tracking-wider text-xs flex items-center gap-1"
                  >
                    <Settings size={14} /> {club.currentBook ? "Mudar Livro" : "Definir Livro"}
                  </Button>
                )}
              </div>

              {club.currentBook ? (
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-zinc-950/40 rounded-2xl border border-white/5 transition-all duration-300 hover:border-white/10">
                  {club.currentBook.cover ? (
                    <img
                      src={club.currentBook.cover}
                      alt={club.currentBook.title}
                      className="w-24 h-36 object-cover rounded-xl shadow-2xl border border-white/10 shrink-0 transform group-hover:scale-[1.03] transition-all duration-500"
                    />
                  ) : (
                    <div className="w-24 h-36 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                      <BookOpen size={32} className="text-zinc-600" />
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h4 className="text-xl font-bold text-white tracking-tight">{club.currentBook.title}</h4>
                    <p className="text-sm font-semibold text-secondary">{club.currentBook.author}</p>
                    {club.currentBook.description && (
                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mt-2">{club.currentBook.description}</p>
                    )}
                    {club.currentBook.categories && club.currentBook.categories.length > 0 && (
                      <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                        {club.currentBook.categories.map((cat: string) => (
                          <span key={cat} className="text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-400 px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-950/30 rounded-2xl border border-white/5">
                  <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Nenhum livro em leitura coletiva</p>
                  {club.creatorId === user?.id ? (
                    <Button
                      size="sm"
                      onClick={() => setShowSelectBook(true)}
                      className="mt-4 bg-secondary hover:bg-secondary/80 font-bold uppercase tracking-wider text-xs px-6 py-2 rounded-xl text-white shadow-lg shadow-secondary/20"
                    >
                      Selecionar um Livro
                    </Button>
                  ) : (
                    <p className="text-[11px] text-neutral-600 mt-1">Aguardando o organizador definir o livro da vez.</p>
                  )}
                </div>
              )}
            </div>

            {/* MODAL SELECIONAR LIVRO */}
            <AnimatePresence>
              {showSelectBook && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSelectBook(false)}
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-surface/90 border border-white/10 backdrop-blur-2xl z-[101] shadow-2xl p-6 rounded-3xl flex flex-col max-h-[80vh]"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                      <h3 className="text-lg font-bold text-white">Selecionar Livro Coletivo</h3>
                      <button
                        onClick={() => setShowSelectBook(false)}
                        className="text-neutral-500 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Buscar na biblioteca..."
                        value={bookSearchQuery}
                        onChange={(e) => setBookSearchQuery(e.target.value)}
                        className="w-full bg-black/40 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 outline-none text-sm focus:border-secondary/50 text-white"
                      />
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[250px] max-h-[400px] pr-1 custom-scrollbar">
                      {isLoadingBooks ? (
                        <div className="flex justify-center py-10">
                          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                        </div>
                      ) : books && books.length > 0 ? (
                        <div className="space-y-2">
                          {books.map((book: any) => (
                            <div
                              key={book.id}
                              onClick={() => {
                                setCurrentBookMutation.mutate(book.id);
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 bg-white/5 hover:bg-secondary/10 border border-white/5 hover:border-secondary/20 rounded-2xl cursor-pointer transition-all duration-300",
                                club.currentBookId === book.id && "border-secondary bg-secondary/10"
                              )}
                            >
                              {book.cover ? (
                                <img
                                  src={book.cover}
                                  alt={book.title}
                                  className="w-10 h-14 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-10 h-14 bg-zinc-800 rounded-lg flex items-center justify-center">
                                  <BookOpen size={16} className="text-zinc-500" />
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <p className="font-bold text-sm text-white truncate">{book.title}</p>
                                <p className="text-xs text-neutral-400 truncate">{book.author}</p>
                              </div>
                              {club.currentBookId === book.id && (
                                <span className="text-[10px] font-black uppercase text-secondary tracking-wider bg-secondary/15 px-2 py-0.5 rounded-full">
                                  Atual
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-neutral-500 text-xs">
                          Nenhum livro encontrado na biblioteca.
                        </div>
                      )}
                    </div>

                    {club.currentBookId && (
                      <div className="pt-4 border-t border-white/5 mt-4">
                        <Button
                          fullWidth
                          variant="ghost"
                          onClick={() => setCurrentBookMutation.mutate(null)}
                          className="text-red-500 hover:text-red-400 font-bold uppercase tracking-wider text-xs"
                        >
                          Remover Livro em Leitura
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* CARD METAS COLETIVAS */}
            <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
              {/* Decorative backgrounds */}
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-secondary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-all duration-700" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-primary w-5 h-5 animate-pulse" />
                  <h3 className="font-display font-bold text-white text-lg">Metas Coletivas do Clube</h3>
                </div>
                {club.creatorId === user?.id && !showAddGoal && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddGoal(true)}
                    className="text-primary hover:text-primary/80 font-bold uppercase tracking-wider text-xs flex items-center gap-1"
                  >
                    <Plus size={14} /> Nova Meta
                  </Button>
                )}
              </div>

              {/* Form de Nova Meta */}
              {showAddGoal && (
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-4 mb-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-black uppercase text-zinc-400">Criar Desafio Coletivo</span>
                    <button onClick={() => setShowAddGoal(false)} className="text-zinc-500 hover:text-white text-xs font-bold uppercase">Cancelar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Título do Desafio</label>
                      <input
                        type="text"
                        placeholder="Ex: Ler a trilogia do Senhor dos Anéis"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Meta de Páginas</label>
                        <input
                          type="number"
                          placeholder="1000"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Data Limite</label>
                        <input
                          type="date"
                          value={newGoalEndDate}
                          onChange={(e) => setNewGoalEndDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-primary/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (!newGoalTitle || !newGoalTarget || !newGoalEndDate) return;
                      createGoalMutation.mutate({
                        title: newGoalTitle,
                        targetPages: parseInt(newGoalTarget),
                        endDate: newGoalEndDate
                      });
                    }}
                    disabled={createGoalMutation.isPending}
                    className="w-full h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    {createGoalMutation.isPending ? "Criando..." : "Criar Desafio"}
                  </Button>
                </div>
              )}

              {/* Renderização das metas existentes */}
              {isLoadingGoals ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : goals && goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal: any) => {
                    const percent = Math.min(100, Math.round((goal.currentPages / goal.targetPages) * 100));
                    const isCompleted = goal.currentPages >= goal.targetPages;
                    return (
                      <div key={goal.id} className="p-4 bg-zinc-950/40 border border-white/5 rounded-2xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                              {goal.title}
                              {isCompleted && (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                                  <Award size={10} /> Concluída!
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <CalendarDays size={12} className="text-zinc-500" /> Até {new Date(goal.endDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-black text-primary tracking-wider">{goal.currentPages} <span className="text-zinc-500">/ {goal.targetPages} págs</span></span>
                            <span className="text-xs font-black text-zinc-400 ml-2">({percent}%)</span>
                          </div>
                        </div>

                        {/* Termômetro SVG Interativo */}
                        <div className="relative mb-3.5">
                          <svg width="100%" height="12" className="overflow-visible rounded-full">
                            <rect x="0" y="0" width="100%" height="12" rx="6" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                            <rect x="0" y="0" width={`${percent}%`} height="12" rx="6" fill="url(#neon-gradient)" className="transition-all duration-700 ease-out" />
                            <rect x="0" y="0" width={`${percent}%`} height="12" rx="6" fill="transparent" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="4" className="blur-[4px] pointer-events-none transition-all duration-700 ease-out" style={{ display: percent > 0 ? 'block' : 'none' }} />
                            <defs>
                              <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="50%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        {/* Contribuir Progresso */}
                        {contribGoalId === goal.id ? (
                          <div className="flex gap-2 items-center bg-black/30 p-2.5 rounded-xl border border-white/5 animate-in fade-in duration-300">
                            <input
                              type="number"
                              placeholder="Páginas lidas"
                              value={contribPages}
                              onChange={(e) => setContribPages(e.target.value)}
                              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary/50"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                if (!contribPages) return;
                                addProgressMutation.mutate({ goalId: goal.id, pages: parseInt(contribPages) });
                              }}
                              disabled={addProgressMutation.isPending}
                              className="bg-primary text-white font-bold text-xs rounded-lg px-4"
                            >
                              {addProgressMutation.isPending ? "Somando..." : "Somar"}
                            </Button>
                            <button
                              onClick={() => setContribGoalId(null)}
                              className="text-zinc-500 hover:text-white text-xs px-2 font-bold uppercase"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          !isCompleted && (
                            <button
                              onClick={() => setContribGoalId(goal.id)}
                              className="text-xs font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                              <Plus size={14} /> Contribuir com minhas páginas
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-zinc-950/30 rounded-2xl border border-white/5">
                  <Target className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Sem metas ativas no momento</p>
                  <p className="text-[11px] text-neutral-600 mt-1">Estimule a leitura coletiva criando a primeira meta!</p>
                </div>
              )}
            </div>

            <div className="flex gap-8 border-b border-white/5 pb-1">
                {["feed", "membros", "biblioteca"].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-3 text-sm font-bold uppercase tracking-widest transition-all relative",
                            activeTab === tab ? "text-primary" : "text-neutral-500 hover:text-white"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Discussion Feed Tab */}
            {activeTab === "feed" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="glass-card p-6">
                      <div className="flex gap-4 mb-4">
                        <Avatar user={{ name: user?.username || "Você" }} />
                        <div className="flex-1">
                            <textarea 
                                placeholder="Inicie uma nova discussão no clube ou compartilhe uma reflexão por voz..."
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                className="w-full bg-black/40 p-4 rounded-xl border border-white/10 outline-none focus:border-primary/50 text-white text-sm min-h-[80px] resize-y"
                            />
                        </div>
                      </div>

                      {/* Gravador de áudio integrado */}
                      {showRecorder && (
                        <div className="mb-4">
                          <AudioRecorder 
                            onAudioReady={(base64) => {
                              setAudioBase64(base64);
                              setShowRecorder(false);
                            }}
                            onCancel={() => {
                              setShowRecorder(false);
                              setAudioBase64(null);
                            }}
                          />
                        </div>
                      )}

                      {/* Player para ouvir o áudio gravado antes de enviar */}
                      {audioBase64 && (
                        <div className="mb-4 flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-2xl max-w-sm w-full">
                          <AudioPlayer src={audioBase64} />
                          <button 
                            onClick={() => setAudioBase64(null)} 
                            className="text-red-500 hover:text-red-400 font-black text-xs px-2.5 py-1 uppercase tracking-wider transition-all"
                          >
                            Remover
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                          <Button 
                            type="button"
                            size="sm" 
                            variant="ghost"
                            className="rounded-full text-neutral-400 hover:text-white flex items-center gap-1.5"
                            onClick={() => setShowRecorder(true)}
                            disabled={!!audioBase64 || showRecorder}
                          >
                            <Mic size={16} /> Gravar Insight por Voz
                          </Button>
                          <Button 
                            size="sm" 
                            className="rounded-full font-black bg-primary flex items-center gap-1.5"
                            onClick={handlePostDiscussion}
                            disabled={createPostMutation.isPending || !postText.trim()}
                          >
                              {createPostMutation.isPending ? (
                                <>Publicando... <Loader2 size={16} className="animate-spin" /></>
                              ) : (
                                <>Postar <Plus size={16} /></>
                              )}
                          </Button>
                      </div>
                  </div>

                  {isLoadingFeed ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : feed && feed.length > 0 ? (
                    feed.map((post: any) => (
                      <Card key={post.id} className="p-6 glass-card border-white/5 hover:border-white/10 transition-all duration-300">
                          <div className="flex justify-between mb-4">
                              <div className="flex gap-3 items-center">
                                  <Avatar user={{ name: post.author?.username, avatar: post.author?.avatar }} />
                                  <div>
                                      <h5 className="font-bold text-sm text-white">{post.author?.username || "Leitor Anônimo"}</h5>
                                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
                                        {post.author?.id === club.creatorId ? "Fundador • " : ""}
                                        {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                                          day: "numeric",
                                          month: "short",
                                          hour: "2-digit",
                                          minute: "2-digit"
                                        })}
                                      </p>
                                  </div>
                              </div>
                              <button className="text-neutral-600 hover:text-white"><MoreVertical size={18} /></button>
                          </div>
                          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {post.content}
                          </p>

                          {/* Se houver gravação de voz no post */}
                          {post.audioUrl && (
                            <div className="mt-4">
                              <AudioPlayer src={post.audioUrl} />
                            </div>
                          )}

                          <div className="flex gap-6 text-xs font-bold text-neutral-500 border-t border-white/5 pt-4 mt-6">
                              <button className="hover:text-primary transition-colors">0 Curtidas</button>
                              <button className="hover:text-primary transition-colors">0 Comentários</button>
                          </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 glass-card rounded-[2rem] border-white/5">
                      <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-500 font-medium">Nenhuma discussão foi criada ainda. Que tal ser o primeiro?</p>
                    </div>
                  )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "membros" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                {club.members && club.members.length > 0 ? (
                  club.members.map((member: any) => (
                    <Card key={member.id} className="p-5 glass-card flex items-center justify-between border-white/5 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Avatar user={{ name: member.user?.username, avatar: member.user?.avatar }} />
                        <div>
                          <h5 className="font-bold text-sm text-white">{member.user?.username || "Membro"}</h5>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full",
                            member.role === "ADMIN" 
                              ? "bg-primary/20 text-primary border border-primary/30" 
                              : "bg-white/5 text-neutral-400 border border-white/10"
                          )}>
                            {member.role === "ADMIN" ? "Fundador" : "Membro"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-semibold">
                        Desde {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 glass-card">
                    <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">Este clube ainda não tem membros cadastrados.</p>
                  </div>
                )}
              </div>
            )}

            {/* Library / Events Tab */}
            {activeTab === "biblioteca" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                {club.events && club.events.length > 0 ? (
                  club.events.map((event: any) => (
                    <Card key={event.id} className="p-6 glass-card relative overflow-hidden group border-white/5 hover:border-secondary/40 transition-all duration-500">
                      <div className="absolute top-0 right-0 p-3 bg-secondary/20 text-secondary text-[9px] font-black rounded-bl-2xl uppercase tracking-widest border-l border-b border-white/5">
                        Encontro
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">{event.title}</h4>
                      <p className="text-neutral-400 text-xs mb-6 line-clamp-2 leading-relaxed">{event.description}</p>
                      
                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <div className="flex items-center text-[11px] text-neutral-400 font-bold gap-2">
                          <MapPin size={12} className="text-secondary" />
                          <span>{event.location || "Online"}</span>
                        </div>
                        <div className="flex items-center text-[11px] text-neutral-400 font-bold gap-2">
                          <Calendar size={12} className="text-secondary" />
                          <span>{new Date(event.date).toLocaleDateString("pt-BR")} às {event.time || "20:00"}</span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 glass-card">
                    <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">Nenhum evento agendado para este clube no momento.</p>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* SIDE BAR / CALLS & CHAT */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* RODA DE CONVERSA POR VOZ WEBRTC */}
            <AudioRooms clubId={clubId} />

            {/* CHAT DO CLUBE */}
            <aside className="glass-card h-[450px] flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2 text-sm">
                      <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} /> 
                      Chat do Clube
                    </h3>
                    <Search size={16} className="text-neutral-500" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((chat: any) => (
                        <div key={chat.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Avatar user={{ name: chat.author?.username }} size="sm" />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-primary mb-0.5">
                                  {chat.author?.username} 
                                  <span className="text-neutral-600 ml-1.5">
                                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </p>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 text-xs text-neutral-300">
                                    {chat.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Mensagem para o grupo..."
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="w-full bg-black/40 pl-4 pr-12 py-3 rounded-full border border-white/10 outline-none text-sm focus:border-primary/50 text-white"
                        />
                        <button 
                          onClick={handleSend}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </div>

      </div>
    </div>
  );
}
