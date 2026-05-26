"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  BookOpen, 
  Send, 
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Calendar,
  Zap,
  Star
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { bookService, authService, clubService } from "@/services";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PDFFlipReader = dynamic(
  () => import("@/components/features/PDFFlipReader").then((mod) => mod.PDFFlipReader),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const [newPost, setNewPost] = useState("");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ url: string; title: string } | null>(null);

  const openReader = (url: string, title: string) => {
    setSelectedBook({ url, title });
    setIsReaderOpen(true);
  };

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: bookService.getRecommendations,
  });

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["feed-global"],
    queryFn: () => clubService.getGlobalFeed(),
  });

  const user = profile || { username: "Carregando...", level: 1, points: 0, streak: 0 };
  const books = recommendations || [];
  const posts = feedData || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT SIDEBAR: User Stats */}
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-6 sticky top-24 hidden lg:block"
      >
        <div className="glass-card p-6 overflow-hidden relative border border-white/5 bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-black/50">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-[60px]" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110" />
              <Avatar user={{ name: user.username, avatar: user.avatar }} className="ring-4 ring-primary/20 w-24 h-24 relative z-10" />
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-2 -right-2 z-20"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-black text-xs font-black">LVL</div>
              </motion.div>
            </div>
            <h3 className="font-black text-2xl tracking-tighter">{user.username}</h3>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2 opacity-80 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">LEITOR EXPLORADOR</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-10">
            <div className="bg-white/2 rounded-3xl p-5 text-center border border-white/5 hover:bg-white/5 transition-colors group">
              <TrendingUp className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" size={20} />
              <p className="text-2xl font-black">{user.points}</p>
              <p className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">PONTOS</p>
            </div>
            <div className="bg-white/2 rounded-3xl p-5 text-center border border-white/5 hover:bg-white/5 transition-colors group">
              <Zap className="mx-auto mb-2 text-yellow-500 group-hover:scale-110 transition-transform" size={20} />
              <p className="text-2xl font-black">{user.streak}</p>
              <p className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">RACHA</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Sua Jornada</h4>
            
            {/* Author Specialist Insight */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 group cursor-help transition-all hover:bg-primary/20">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-1.5 bg-primary text-white rounded-lg">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase">80%</span>
               </div>
               <p className="text-xs font-black text-white leading-tight">Especialista em Machado</p>
               <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary w-[80%] shadow-[0_0_10px_rgba(80,70,229,0.5)]" />
               </div>
               <p className="text-[9px] text-neutral-500 mt-2 font-bold line-clamp-1 italic italic">Faltam 2 obras para o selo Real</p>
            </div>

            {/* Reading Habit Insight */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 group cursor-help transition-all hover:bg-secondary/20">
               <div className="flex justify-between items-center mb-2">
                  <div className="p-1.5 bg-secondary text-white rounded-lg">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <span className="text-[9px] font-black text-secondary uppercase">Novo</span>
               </div>
               <p className="text-xs font-black text-white leading-tight">Coruja de Biblioteca</p>
               <p className="text-[10px] text-neutral-500 mt-1 font-bold">90% das suas leituras acontecem após às 22h.</p>
            </div>

            <div className="flex justify-between text-[10px] font-black mb-1 uppercase tracking-widest mt-6">
              <span className="text-neutral-500">EXPERIÊNCIA</span>
              <span className="text-primary">{(user.points % 100)}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${user.points % 100}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] rounded-full shadow-[0_0_15px_rgba(80,70,229,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* CENTER: Main Feed */}
      <main className="lg:col-span-6 space-y-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-white/5 bg-white/2 backdrop-blur-2xl rounded-[2rem] group focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-500 shadow-2xl shadow-black/20">
            <div className="flex gap-4">
              <Avatar user={{ name: user.username, avatar: user.avatar }} className="w-12 h-12 ring-2 ring-white/5 shadow-lg shadow-black" />
              <div className="flex-1">
                <textarea 
                  placeholder="Compartilhe seus progressos ou ideias..."
                  className="w-full bg-black/40 p-5 rounded-2xl border border-white/5 outline-none focus:border-primary/30 transition-all placeholder:text-neutral-600 resize-none min-h-[120px] text-lg font-medium text-white scrollbar-hide"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-2 text-neutral-500">
                    <button className="p-3 rounded-2xl bg-white/5 hover:text-primary transition-all hover:bg-primary/10 group/icon">
                        <BookOpen size={20} className="group-hover/icon:scale-110 transition-transform" />
                    </button>
                    <button className="p-3 rounded-2xl bg-white/5 hover:text-secondary transition-all hover:bg-secondary/10 group/icon">
                        <Share2 size={20} className="group-hover/icon:scale-110 transition-transform" />
                    </button>
                  </div>
                  <Button 
                    disabled={!newPost.trim()} 
                    className="px-10 h-12 rounded-full bg-primary text-white font-black shadow-[0_8px_30px_rgb(80,70,229,0.4)] hover:shadow-primary/60 transition-all uppercase tracking-widest text-[10px]"
                  >
                    POSTAR <Send size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Reading Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 md:p-10 bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/10"
        >
          <div className="absolute -right-32 -top-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px] group-hover:bg-primary/40 transition-all duration-1000 group-hover:translate-x-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="w-40 md:w-56 h-auto aspect-[3/4] flex-shrink-0 relative group-hover:rotate-6 group-hover:-translate-y-2 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden rounded-[1.5rem] border border-white/10">
              <img 
                src="/premium_book_cover_sci_fi.png" 
                alt="Destaque" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3 h-3 fill-primary" /> LEITURA DO CLUBE
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">Duna: O Épico das Areias</h2>
              <p className="text-neutral-400 text-sm md:text-lg leading-relaxed max-w-sm font-medium">
                Acesse o manuscrito digital com nossa tecnologia de virada de páginas em 3D.
              </p>
              <div className="pt-2">
                <Button 
                  onClick={() => openReader("/books/duna.pdf", "Duna - Edição do Clube")}
                  className="rounded-full px-10 bg-white text-black font-black hover:bg-neutral-200 shadow-2xl shadow-white/10 h-14 group/btn transition-all active:scale-95"
                >
                  ABRIR LIVRO 3D <BookOpen className="ml-3 w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {posts.length > 0 ? posts.map((post: any, idx: number) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
            >
              <Card className="p-8 border-white/5 bg-white/2 backdrop-blur-2xl rounded-[2.5rem] group hover:border-primary/20 transition-all duration-300 shadow-2xl shadow-black/40">
                <div className="flex gap-5">
                  <Avatar user={{ name: post.author.username, avatar: post.author.avatar }} className="w-12 h-12 ring-2 ring-primary/20 shadow-lg" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-black text-white text-lg tracking-tighter group-hover:text-primary transition-colors uppercase">
                          {post.author.username}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/10">Clube</span>
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white rounded-full">
                        <MoreHorizontal size={20} />
                      </Button>
                    </div>

                    <p className="text-neutral-300 text-lg leading-relaxed mb-8 font-medium">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                      <button className="flex items-center gap-3 text-neutral-500 hover:text-red-500 transition-all group/btn">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover/btn:bg-red-500/10 transition-colors">
                           <Heart size={20} className="group-hover/btn:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest leading-none">0</span>
                      </button>
                      <button className="flex items-center gap-3 text-neutral-500 hover:text-primary transition-all group/btn">
                         <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover/btn:bg-primary/10 transition-colors">
                           <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest leading-none">Responder</span>
                      </button>
                      <div className="flex-1" />
                      <button className="p-2 text-neutral-500 hover:text-white transition-all hover:scale-110">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )) : (
            <div className="text-center py-20 text-neutral-500 border-2 border-dashed border-white/5 rounded-3xl">
              Nenhuma discussão encontrada no seu feed.
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* RIGHT SIDEBAR: Suggested Books & Events */}
      <motion.aside 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-8 sticky top-24"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-secondary" /> Sugestões para Você
          </h3>
          <div className="space-y-4">
            {books.map((book: any) => (
              <div 
                key={book.id} 
                onClick={() => openReader(book.pdfUrl || "/books/duna.pdf", book.title)}
                className="glass-card p-4 flex gap-4 cursor-pointer group hover:bg-white/5 active:scale-95 transition-all border border-white/5 bg-white/2 backdrop-blur-xl rounded-[1.5rem] shadow-xl shadow-black/20"
              >
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0 shadow-2xl border border-white/10">
                  <img src={book.cover || "/premium_book_cover_sci_fi.png"} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-center">
                  <h5 className="font-black text-sm text-white line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-snug">{book.title}</h5>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-black tracking-widest">{book.author}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex text-yellow-500">
                       <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-black text-white/40">5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all border border-dashed border-primary/20">VER BIBLIOTECA COMPLETA</Button>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 overflow-hidden relative group cursor-pointer rounded-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
            <Calendar size={80} />
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Próximo Evento</p>
          <h4 className="font-bold text-lg mb-1">Debate: Machado de Assis</h4>
          <p className="text-xs text-neutral-400 mb-4 flex items-center gap-2">
            <Calendar size={14} /> Amanhã, 19:30 • Online
          </p>
          <Button 
            className="w-full rounded-xl bg-white text-black font-black hover:bg-neutral-200"
            onClick={() => router.push('/dashboard/events')}
          >
            Ver Detalhes
          </Button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isReaderOpen && selectedBook && (
          <PDFFlipReader 
            fileUrl={selectedBook.url} 
            title={selectedBook.title}
            onClose={() => setIsReaderOpen(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
