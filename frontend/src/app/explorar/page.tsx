"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  BookOpen, 
  Star, 
  ArrowRight, 
  Loader2, 
  Lock, 
  X,
  Compass,
  Sparkles,
  Heart,
  Sword,
  Cpu,
  TrendingUp,
  Tv,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { clubService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";

const CATEGORIES = ["Todos", "Ficção", "Romance", "Fantasia", "Tecnologia", "Mistério", "Negócios", "Anime & Mangá"];

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  "Todos": Compass,
  "Ficção": Sparkles,
  "Romance": Heart,
  "Fantasia": Sword,
  "Tecnologia": Cpu,
  "Mistério": Search,
  "Negócios": TrendingUp,
  "Anime & Mangá": Tv,
};

const COVERS = [
  "/club_cover.png",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop"
];

const getCover = (id: string, index: number) => {
  return COVERS[index % COVERS.length];
};

const getCategory = (club: any) => {
  const desc = (club.description || "").toLowerCase();
  const name = club.name.toLowerCase();
  if (desc.includes("anime") || desc.includes("mangá") || desc.includes("manga") || desc.includes("otaku") || desc.includes("novel") || name.includes("anime") || name.includes("manga") || name.includes("otaku") || name.includes("novel")) return "Anime & Mangá";
  if (desc.includes("tecnologia") || name.includes("tech") || desc.includes("cyber") || name.includes("cyber")) return "Tecnologia";
  if (desc.includes("romance") || name.includes("romance")) return "Romance";
  if (desc.includes("fantasia") || name.includes("fantasia")) return "Fantasia";
  if (desc.includes("mistério") || desc.includes("suspense") || name.includes("mistério")) return "Mistério";
  if (desc.includes("negócios") || desc.includes("growth") || name.includes("negócios")) return "Negócios";
  return "Ficção";
};

const getRating = (name: string) => {
  const charCode = name.charCodeAt(0) || 0;
  return ((charCode % 5) / 10 + 4.5).toFixed(1);
};

export default function ExplorarPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todos");

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubService.getAll(),
  });

  const filteredClubs = (clubs || []).filter((club: any) => {
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase()) || 
                          (club.city || "").toLowerCase().includes(search.toLowerCase()) ||
                          (club.description || "").toLowerCase().includes(search.toLowerCase());
    const cat = getCategory(club);
    const matchesCat = selectedCat === "Todos" || cat === selectedCat;
    return matchesSearch && matchesCat;
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Mapeando Tribos Literárias...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24 px-4 md:px-8 relative">
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[180px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Header & Search */}
      <section className="relative min-h-[420px] flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-black/40 to-slate-950/40 backdrop-blur-md shadow-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--bg-radial-1)_0%,_transparent_70%)] opacity-30 pointer-events-none" />
        
        {/* Decorative Active Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-black uppercase tracking-[0.25em] flex items-center gap-2 shadow-inner"
        >
          <Sparkles size={12} className="animate-spin text-primary" style={{ animationDuration: '4s' }} />
          <span>Comunidade Ativa</span>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black mb-6 tracking-tight leading-none text-white"
        >
            Explore Novas <span className="bg-gradient-to-r from-primary-light via-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">Tribos.</span>
        </motion.h1>
        
        <p className="text-neutral-400 text-base md:text-lg max-w-2xl mb-12 font-medium leading-relaxed">
            Descubra comunidades de leitura vibrantes, participe de rodas de conversa interativas e encontre sua próxima grande obsessão literária.
        </p>

        <div className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur-xl opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-black/60 rounded-2xl border border-white/10 p-2 pl-6 shadow-2xl transition-all duration-300 group-focus-within:border-primary/50 group-focus-within:bg-black/80">
            <Search className="text-neutral-500 mr-4 shrink-0" size={24} />
            <input 
              type="text" 
              placeholder="Buscar por nome do clube, cidade, descrição ou mangá..." 
              className="flex-1 bg-transparent outline-none text-base md:text-lg font-medium py-4 text-white placeholder-neutral-500 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="hidden md:flex rounded-xl px-10 h-full bg-gradient-to-r from-primary to-primary-dark font-black text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all">
              Pesquisar
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1 px-1">
          <Filter size={14} className="text-primary-light" />
          <span className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-400">Filtrar por Gênero</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || Compass;
            const isSelected = selectedCat === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  "px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 transition-all cursor-pointer border",
                  isSelected 
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white border-transparent shadow-lg shadow-primary/25 scale-[1.03]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border-white/5 hover:border-white/10"
                )}
              >
                <Icon size={14} className={cn("transition-transform duration-300", isSelected ? "scale-110 rotate-12" : "group-hover:scale-110")} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClubs.map((club: any, i: number) => {
          const rating = getRating(club.name);
          const cover = getCover(club.id, i);
          const cat = getCategory(club);
          const membersCount = club._count?.members || 0;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              key={club.id}
            >
              <Card className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-white/5 hover:border-primary-light/40 transition-all duration-500 bg-[#070709] shadow-2xl flex flex-col justify-end">
                {/* Background Image with animated zoom */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-slate-950/70 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
                  <img 
                    src={cover} 
                    alt={club.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out opacity-80 group-hover:opacity-95" 
                  />
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="glass px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black border border-white/10 shadow-lg text-white">
                      <Star size={12} fill="#F59E0B" stroke="none" className="animate-pulse" />
                      <span>{rating}</span>
                  </div>
                </div>

                {/* Info & Action content */}
                <div className="relative bottom-0 left-0 p-8 z-20 w-full backdrop-blur-[2px] bg-gradient-to-t from-black via-black/40 to-transparent">
                  <div className="flex gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full text-white shadow-md">
                      {cat}
                    </span>
                    {club.isPrivate && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 border border-white/10 px-3 py-1 rounded-full text-neutral-300 flex items-center gap-1">
                        <Lock size={8} /> Privado
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-2 tracking-tight group-hover:text-primary-light transition-colors duration-300 line-clamp-1">
                    {club.name}
                  </h3>

                  <p className="text-neutral-400 text-xs font-medium mb-5 line-clamp-2 leading-relaxed h-8">
                    {club.description || "Um ponto de encontro de mentes curiosas para ler e debater."}
                  </p>
                  
                  <div className="flex items-center text-neutral-400 text-xs gap-4 mb-6 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1.5 font-bold text-neutral-300"><Users size={13} className="text-secondary"/> {membersCount} {membersCount === 1 ? 'membro' : 'membros'}</span>
                    <span className="flex items-center gap-1.5 font-bold text-neutral-300"><MapPin size={13} className="text-secondary"/> {club.city || "Global"}</span>
                  </div>

                  <a 
                    href={`/clubes/${club.id}`}
                    onClick={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <Button fullWidth className="rounded-2xl py-4.5 bg-white text-black font-black hover:bg-gradient-to-r hover:from-white hover:to-neutral-100 flex items-center justify-center gap-2 group/btn shadow-xl active:scale-[0.98] transition-all">
                      Ver Detalhes <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </Button>
                  </a>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stunning Empty State */}
      {filteredClubs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-slate-950/40 to-black/40 backdrop-blur-md p-10 md:p-14 text-center shadow-3xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/25 rounded-full blur-[80px] pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5">
            <BookOpen size={36} className="text-primary-light" />
          </div>

          <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-3 uppercase tracking-tight">
            Nenhuma Tribo Encontrada
          </h3>
          
          <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Não encontramos nenhum clube correspondente com o filtro <span className="text-primary-light font-bold">"{selectedCat}"</span> ou busca <span className="text-primary-light font-bold">"{search}"</span>. Que tal redefinir seus filtros ou ser o pioneiro a fundar esta comunidade?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm mx-auto">
            <Button
              onClick={() => {
                setSearch("");
                setSelectedCat("Todos");
              }}
              className="rounded-xl bg-white text-black font-black uppercase tracking-wider text-[10px] h-12 flex-1 hover:bg-neutral-100 transition-colors"
            >
              Limpar Filtros
            </Button>
            
            <a href="/dashboard/clubs" className="flex-1">
              <Button
                variant="outline"
                className="rounded-xl border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-wider text-[10px] h-12 w-full flex items-center justify-center gap-1.5"
              >
                <Plus size={12} /> Criar Novo Clube
              </Button>
            </a>
          </div>
        </motion.div>
      )}

      {/* Auth Interception Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#070709] p-8 md:p-12 shadow-[0_0_50px_rgba(139,92,246,0.25)] z-10 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                  <Lock size={26} className="animate-pulse" />
                </div>

                <h3 className="text-3xl font-display font-black text-white mb-4 uppercase tracking-tight leading-none">
                  ENTRE NA SUA <span className="text-primary">TRIBO!</span>
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-sm">
                  O Leituri é uma rede social viva de leitores! Faça login ou crie uma conta gratuita para debater em salas de áudio WebRTC, escutar insights por voz, acompanhar metas neon e evoluir sua semente interativa.
                </p>

                <div className="space-y-3 w-full">
                  <Button
                    onClick={() => router.push("/register")}
                    fullWidth
                    className="rounded-2xl py-4.5 bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest text-[10px] h-14 hover:scale-[1.02] transition-transform"
                  >
                    Criar Conta Grátis
                  </Button>

                  <Button
                    onClick={() => router.push("/login")}
                    fullWidth
                    variant="outline"
                    className="rounded-2xl py-4.5 border-white/10 hover:bg-white/5 text-neutral-300 font-black uppercase tracking-widest text-[10px] h-14"
                  >
                    Já tenho uma conta
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
