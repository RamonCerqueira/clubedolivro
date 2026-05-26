"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  MapPin, 
  Compass, 
  Users, 
  Plus, 
  Filter, 
  MessageSquare,
  ArrowRight,
  Loader2,
  Trophy,
  X
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClubChat } from "@/components/ClubChat";
import { cn } from "@/lib/utils";
import { clubService } from "@/services";
import { motion, AnimatePresence } from "framer-motion";

export default function ClubsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeClub, setActiveClub] = useState<any | null>(null);

  // Create club form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [clubCity, setClubCity] = useState("");
  const [clubIsPrivate, setClubIsPrivate] = useState(false);

  const { data: clubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubService.getAll(),
  });

  const createClubMutation = useMutation({
    mutationFn: () => clubService.create({
      name: clubName,
      description: clubDesc,
      city: clubCity,
      isPrivate: clubIsPrivate,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      setIsCreateModalOpen(false);
      // Reset form
      setClubName("");
      setClubDesc("");
      setClubCity("");
      setClubIsPrivate(false);
    },
  });

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName) return;
    createClubMutation.mutate();
  };

  const filteredClubs = clubs?.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (activeClub) {
    return (
      <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
        <ClubChat 
          club={{ id: activeClub.id, name: activeClub.name, members: activeClub.membersCount }} 
          onClose={() => setActiveClub(null)} 
        />
      </div>
    );
  }

  if (isLoadingClubs) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Mapeando Comunidades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Comunidades</h1>
          <p className="text-neutral-500 font-medium">Encontre seu próximo grupo de leitura ou crie um novo.</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/20 rounded-2xl px-8 py-6 font-black uppercase tracking-widest text-xs"
        >
          <Plus size={20} className="mr-2" /> Criar Clube
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, gênero ou cidade..." 
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-white placeholder:text-neutral-600 font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="px-6 rounded-2xl bg-white/5 border border-white/10">
          <Filter size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredClubs.length > 0 ? filteredClubs.map((club: any) => (
          <Card 
            key={club.id} 
            className="p-10 border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col group relative overflow-hidden bg-white/2 rounded-[2.5rem]"
          >
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
            
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-white leading-tight pr-8 group-hover:text-primary transition-colors uppercase tracking-tight">
                {club.name}
              </h3>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-black text-neutral-400 mb-8 uppercase tracking-[0.2em]">
               {club.city === 'Global' || !club.city ? (
                 <span className="flex items-center gap-2 text-blue-400">
                   <Compass size={16} /> Global
                 </span>
               ) : (
                 <span className="flex items-center gap-2 text-emerald-400">
                   <MapPin size={16} /> {club.city}
                 </span>
               )}
               <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
               <span className="flex items-center gap-2">
                 <Users size={16} className="text-secondary" /> {club.membersCount || 0} LEITORES
               </span>
            </div>

            <p className="text-neutral-400 mb-10 line-clamp-3 leading-relaxed font-medium italic">
              "{club.description || "Uma nova comunidade literária florescendo no horizonte..."}"
            </p>
            
            <div className="flex flex-wrap gap-2 mb-10">
              {club.categories?.map((cat: string) => (
                <span key={cat} className="text-[10px] uppercase font-black bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl tracking-widest">
                  {cat}
                </span>
              )) || (
                <span className="text-[10px] uppercase font-black bg-white/5 text-neutral-600 border border-white/10 px-4 py-2 rounded-xl tracking-widest">
                  Geral
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
              <Button 
                variant={club.isMember ? "outline" : "primary"} 
                className={cn(
                  "flex-1 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all",
                  !club.isMember && "bg-gradient-to-r from-primary to-secondary text-white border-none shadow-xl shadow-primary/20"
                )}
              >
                {club.isMember ? "MEMBRO" : "SOLICITAR ACESSO"}
              </Button>
              {club.isMember && (
                <Button 
                  variant="secondary" 
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/10 group/btn transition-all" 
                  onClick={() => setActiveClub(club)}
                >
                  <MessageSquare size={24} className="group-hover/btn:text-primary transition-colors" />
                </Button>
              )}
              <Button variant="ghost" className="w-16 h-16 rounded-2xl text-neutral-600 hover:text-white transition-all">
                <ArrowRight size={24} />
              </Button>
            </div>
          </Card>
        )) : (
          <div className="col-span-full py-40 text-center bg-white/2 rounded-[3rem] border-2 border-dashed border-white/5">
             <Compass className="w-20 h-20 text-neutral-800 mx-auto mb-8 animate-pulse" />
             <p className="text-neutral-500 font-black uppercase tracking-[0.3em]">O vasto deserto literário aguarda sua primeira pegada.</p>
          </div>
        )}
      </div>

      {/* CREATE CLUB MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-black text-white tracking-tight uppercase">Criar Novo Clube</h2>
                   <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">Reunir entusiastas literários</p>
                 </div>
                 <button onClick={() => setIsCreateModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleCreateClub} className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Nome do Clube</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Leitores Rebeldes"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                    value={clubName}
                    onChange={e => setClubName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Descrição / Filosofia</label>
                  <textarea 
                    placeholder="Qual é a proposta do clube?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold min-h-[100px] resize-none"
                    value={clubDesc}
                    onChange={e => setClubDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Cidade / Sede (ou 'Global')</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Rio de Janeiro, RJ ou Global"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                    value={clubCity}
                    onChange={e => setClubCity(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-white/10 bg-black text-primary"
                    checked={clubIsPrivate}
                    onChange={e => setClubIsPrivate(e.target.checked)}
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Clube Privado</span>
                    <span className="text-[9px] text-neutral-500 block uppercase tracking-widest mt-0.5">Requer aprovação para novos membros</span>
                  </div>
                </label>

                <div className="flex gap-4 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createClubMutation.isPending || !clubName}
                    className="flex-[2] bg-primary text-white font-black rounded-xl"
                  >
                    {createClubMutation.isPending ? "Criando..." : "Criar Clube"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
