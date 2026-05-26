"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  Navigation, 
  Plus, 
  Loader2, 
  Search, 
  Info,
  Clock,
  Compass,
  Lock,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { eventService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";

export default function EventosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [radarRadius, setRadarRadius] = useState(10); // km

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAll()
  });

  const filteredEvents = (events || []).filter((event: any) => {
    const term = search.toLowerCase();
    const titleMatch = event.title.toLowerCase().includes(term);
    const descMatch = (event.description || "").toLowerCase().includes(term);
    const clubMatch = (event.club?.name || "").toLowerCase().includes(term);
    const addressMatch = (event.address || "").toLowerCase().includes(term);
    return titleMatch || descMatch || clubMatch || addressMatch;
  });

  // Filtrar eventos presenciais para o Radar
  const physicalEvents = filteredEvents.filter((e: any) => e.type === "PRESENTIAL" && e.locationLat && e.locationLng);

  // Centralização geográfica baseada em SP por padrão, ou no primeiro evento presencial
  const centerLat = -23.5505;
  const centerLng = -46.6333;

  const getRelativeCoords = (lat: number, lng: number) => {
    const scale = 2500; // fator de zoom do radar
    const dx = (lng - centerLng) * scale;
    const dy = -(lat - centerLat) * scale;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const maxRadius = 180; // limite visual do círculo do radar (raio = 200)
    let x = 400 + dx;
    let y = 250 + dy;
    
    if (dist > maxRadius) {
      x = 400 + (dx / dist) * maxRadius;
      y = 250 + (dy / dist) * maxRadius;
    }
    
    return { x, y, isOut: dist > maxRadius };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const month = months[date.getMonth()];
    return { day, month };
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Section */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 py-8">
        <div>
          <h1 className="text-5xl font-display font-black mb-2">
            Próximos <span className="text-secondary">Encontros.</span>
          </h1>
          <p className="text-neutral-400">
            Participe de debates, lançamentos e encontros da sua comunidade.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar encontros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary/50 text-white font-medium"
            />
          </div>

          <div className="glass-card p-1 rounded-2xl flex border-white/5 shrink-0">
            <button 
              onClick={() => setView("list")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${view === 'list' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setView("map")}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${view === 'map' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              Radar
            </button>
          </div>
          <a 
            href="/dashboard/events"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setShowAuthModal(true);
              }
            }}
          >
            <Button className="rounded-xl bg-primary font-black px-6 flex items-center gap-1.5 shrink-0">
              <Plus size={18} /> Criar Evento
            </Button>
          </a>
        </div>
      </section>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Escaneando Encontros Físicos e Digitais...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[2.5rem] border-white/5 max-w-md mx-auto">
          <Compass className="w-16 h-16 text-neutral-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">Nenhum evento encontrado</h3>
          <p className="text-neutral-500 text-sm">Não encontramos nenhum encontro correspondente à sua busca. Experimente redefinir os termos.</p>
        </div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event: any, i: number) => {
              const { day, month } = formatDate(event.date);
              const isOnline = event.type === "ONLINE";
              const rsvpsCount = event._count?.rsvps || 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={event.id}
                >
                    <Card className="p-0 overflow-hidden flex flex-col md:flex-row h-full group border-white/5 hover:border-secondary/30 transition-all duration-500 glass-card bg-surface/50 shadow-2xl rounded-[2.5rem]">
                        <div className="w-full md:w-44 h-44 md:h-auto bg-gradient-to-br from-secondary/15 to-primary/10 flex flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-white/5 shrink-0">
                            <span className="text-5xl font-black text-white">{day}</span>
                            <span className="text-xs uppercase font-black tracking-[0.2em] text-secondary mt-2">{month}</span>
                            <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isOnline ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"
                            }`}>
                                {isOnline ? "Online" : "Presencial"}
                            </div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-2 block">
                                  {event.club?.name || "Clube Geral"}
                                </span>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors text-white line-clamp-2">
                                  {event.title}
                                </h3>
                                <p className="text-neutral-400 text-xs line-clamp-2 mb-6 leading-relaxed">
                                  {event.description || "Nenhuma descrição fornecida para este encontro literário."}
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-bold">
                                        <MapPin size={14} className="text-secondary shrink-0" />
                                        <span className="truncate">{isOnline ? (event.link || "Acesso Remoto") : (event.address || "Endereço Presencial")}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-bold">
                                        <Clock size={14} className="text-secondary shrink-0" />
                                        <span>{event.time || "20:00"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-bold">
                                        <Users size={14} className="text-secondary shrink-0" />
                                        <span>{rsvpsCount} {rsvpsCount === 1 ? "confirmado" : "confirmados"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between">
                              <a href={`/clubes/${event.clubId}`}>
                                <Button className="rounded-xl px-6 border-white/10 hover:bg-white/10 text-xs font-black uppercase tracking-wider" variant="outline">
                                  Ver Clube
                                </Button>
                              </a>
                              <span className="text-[10px] uppercase font-black tracking-widest text-neutral-600">
                                Por: {event.organizer?.username || "Admin"}
                              </span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
              );
            })}
        </div>
      ) : (
        /* Dynamic SVG Neon Radar Map representation for Zero Mock integrity */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interativo Radar SVG Canvas */}
          <div className="lg:col-span-8 h-[550px] w-full rounded-[2.5rem] overflow-hidden glass-card border-white/5 relative bg-black/60 shadow-2xl flex items-center justify-center p-4">
            
            {/* Background grids and circular sweeps */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Radar sweep pulse */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-tr from-secondary/5 via-transparent to-transparent origin-center z-10"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/10 via-black to-black opacity-90" />
            </div>

            <svg viewBox="0 0 800 500" className="w-full h-full relative z-20">
              {/* Radar rings */}
              <circle cx="400" cy="250" r="230" fill="none" stroke="rgba(236, 72, 153, 0.05)" strokeWidth="1" />
              <circle cx="400" cy="250" r="180" fill="none" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="1.5" strokeDasharray="5,5" />
              <circle cx="400" cy="250" r="120" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
              <circle cx="400" cy="250" r="60" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Radar Crosshairs */}
              <line x1="400" y1="20" x2="400" y2="480" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,8" />
              <line x1="170" y1="250" x2="630" y2="250" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,8" />

              {/* Radar core glow */}
              <circle cx="400" cy="250" r="4" fill="#EC4899" className="animate-ping" />
              <circle cx="400" cy="250" r="3" fill="#EC4899" />

              {/* SVG Labels */}
              <text x="410" y="245" fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="bold" letterSpacing="0.1em">SP QG CENTRAL</text>
              <text x="400" y="85" fill="rgba(236, 72, 153, 0.25)" fontSize="9" fontWeight="black" textAnchor="middle">10 KM</text>
              <text x="400" y="145" fill="rgba(139, 92, 246, 0.3)" fontSize="9" fontWeight="black" textAnchor="middle">5 KM</text>
              
              {/* Dynamic physical events mapped */}
              {physicalEvents.map((event: any, idx: number) => {
                const { x, y, isOut } = getRelativeCoords(event.locationLat, event.locationLng);
                const isSelected = selectedEvent?.id === event.id;

                return (
                  <g key={event.id} className="cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    {/* Ring Pulse Glow */}
                    <circle cx={x} cy={y} r="14" fill="none" stroke={isSelected ? "#EC4899" : "#8B5CF6"} strokeWidth="1" opacity="0.3" className="animate-ping" style={{ animationDuration: `${2 + idx * 0.5}s` }} />
                    {/* Event Dot */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isSelected ? "8" : "6"} 
                      fill={isSelected ? "#EC4899" : "#8B5CF6"} 
                      stroke="rgba(0,0,0,0.6)" 
                      strokeWidth="2"
                      className="transition-all duration-300 hover:scale-125"
                    />
                    
                    {/* Event Mini Name Floating label on hover/select */}
                    <text 
                      x={x} 
                      y={y - 12} 
                      fill={isSelected ? "#EC4899" : "#A78BFA"} 
                      fontSize="9" 
                      fontWeight="black" 
                      textAnchor="middle"
                      className="transition-opacity duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    >
                      {event.title.substring(0, 16)}...
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Info overlay */}
            <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-xs font-black text-white tracking-widest uppercase">
                <Compass size={14} className="text-secondary animate-spin" style={{ animationDuration: '6s' }} />
                <span>Radar Geográfico Ativo: {physicalEvents.length} Encontros</span>
              </div>
            </div>
            
            {/* Search radius UI */}
            <div className="absolute top-6 right-6 z-30">
              <div className="glass-card px-4 py-2.5 rounded-xl border border-white/5 flex flex-col gap-1.5 text-right bg-black/40">
                <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">Raio do Sensor</span>
                <span className="text-xs font-black text-primary">{radarRadius} KM</span>
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  value={radarRadius}
                  onChange={(e) => setRadarRadius(Number(e.target.value))}
                  className="accent-primary w-24 h-1 cursor-pointer bg-white/10 rounded-lg appearance-none mt-1" 
                />
              </div>
            </div>
          </div>

          {/* Lateral event preview drawer */}
          <aside className="lg:col-span-4 space-y-6 flex flex-col justify-between min-h-[500px]">
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 border-white/5 bg-surface/40 shadow-2xl rounded-[2.5rem] flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Presencial
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500">
                        LAT: {selectedEvent.locationLat?.toFixed(4)} • LNG: {selectedEvent.locationLng?.toFixed(4)}
                      </span>
                    </div>

                    <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5 block">
                      {selectedEvent.club?.name || "Clube de Leitura"}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-snug">{selectedEvent.title}</h3>
                    <p className="text-neutral-400 text-xs mb-6 leading-relaxed">
                      {selectedEvent.description || "Nenhuma descrição detalhada fornecida para este encontro presencial no radar."}
                    </p>

                    <div className="space-y-3.5 border-t border-white/5 pt-5">
                      <div className="flex items-center gap-3 text-xs text-neutral-300 font-bold">
                        <MapPin size={15} className="text-secondary shrink-0" />
                        <span>{selectedEvent.address || "Ponto de Encontro Físico"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 font-bold">
                        <Calendar size={15} className="text-secondary shrink-0" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 font-bold">
                        <Clock size={15} className="text-secondary shrink-0" />
                        <span>{selectedEvent.time || "20:00"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 font-bold">
                        <Users size={15} className="text-secondary shrink-0" />
                        <span>{selectedEvent._count?.rsvps || 0} Confirmados</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <a href={`/clubes/${selectedEvent.clubId}`}>
                      <Button fullWidth className="bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        Visitar QG do Clube <ArrowRight size={14} />
                      </Button>
                    </a>
                    <Button 
                      fullWidth 
                      variant="ghost" 
                      onClick={() => setSelectedEvent(null)}
                      className="text-neutral-500 hover:text-white text-xs font-black uppercase tracking-wider py-2.5"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8 border-white/5 bg-surface/30 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center"
                >
                  <Navigation size={44} className="text-secondary mb-4 animate-pulse" />
                  <h4 className="font-bold text-white text-lg mb-2">Interação Geográfica</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-[240px]">
                    Selecione ou clique em qualquer ponto luminoso do radar para exibir as coordenadas e informações detalhadas do encontro literário presencial.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="p-6 bg-secondary/10 border-secondary/20 rounded-[2rem] flex gap-3">
              <Info size={20} className="text-secondary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-black uppercase tracking-wider text-secondary">Nota de Calibração</h5>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  O sensor geográfico calcula distâncias relativas no radar a partir do centro geográfico em São Paulo. Eventos online não são exibidos no sensor de radar.
                </p>
              </div>
            </Card>
          </aside>

        </div>
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
                  CRIE SEU <span className="text-primary">EVENTO!</span>
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-sm">
                  Quer organizar encontros presenciais ou virtuais para debater suas leituras e mangas preferidos? Faça login ou registre uma conta para criar novos eventos literários e gerenciar RSVPs!
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
