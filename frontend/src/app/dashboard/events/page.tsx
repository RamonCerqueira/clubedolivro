"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  X, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { eventService, clubService } from "@/services";

export default function EventsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clubId: "",
    type: "ONLINE" as "ONLINE" | "PRESENTIAL",
    description: "",
    date: "",
    link: "",
    address: "",
    participantLimit: "" as string | number
  });
  const queryClient = useQueryClient();

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAll(),
  });

  const { data: myClubs } = useQuery({
    queryKey: ["my-clubs"],
    queryFn: () => clubService.getAll(),
  });

  const rsvpMutation = useMutation({
    mutationFn: (eventId: string) => eventService.rsvp(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleToggleRsvp = (eventId: string) => {
    rsvpMutation.mutate(eventId);
  };

  const createEventMutation = useMutation({
    mutationFn: () => eventService.create({
      title: formData.title,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      clubId: formData.clubId,
      description: formData.description || undefined,
      link: formData.type === "ONLINE" ? formData.link || undefined : undefined,
      address: formData.type === "PRESENTIAL" ? formData.address || undefined : undefined,
      participantLimit: formData.participantLimit ? Number(formData.participantLimit) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreate(false);
      setFormData({
        title: "",
        clubId: "",
        type: "ONLINE",
        description: "",
        date: "",
        link: "",
        address: "",
        participantLimit: ""
      });
    },
  });

  const handleCreate = () => {
    if (!formData.title || !formData.clubId || !formData.date) return;
    createEventMutation.mutate();
  };

  if (isLoadingEvents) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Sincronizando Cronogramas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Eventos</h1>
          <p className="text-neutral-500 font-medium">Participe de debates, lançamentos e encontros literários.</p>
        </div>
        <Button 
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/20 rounded-2xl px-8 py-6 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> AGENDAR ENCONTRO
        </Button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-8 border-primary/20 bg-primary/5 backdrop-blur-2xl relative rounded-[2.5rem]">
              <button 
                onClick={() => setShowCreate(false)}
                className="absolute top-8 right-8 p-2 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
                <Calendar className="text-secondary" /> Criar Novo Evento
              </h2>

              <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl mb-8 flex gap-4 items-start">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="font-black text-amber-500 uppercase tracking-widest text-[10px] mb-2">Protocolo de Criação</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-400 font-medium">
                    <li>O clube selecionado deve ter no mínimo 5 membros para garantir engajamento.</li>
                    <li>O evento será confirmado automaticamente no radar assim que atingir 3 participações.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Título do Encontro</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Debate: Neuromancer" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Clube Organizador</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-white font-bold"
                      value={formData.clubId}
                      onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                    >
                      <option value="" className="bg-surface">Selecione seu clube...</option>
                      {myClubs?.map((c: any) => (
                        <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 rotate-90 pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Data e Hora</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Limite de Participantes (opcional)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 20" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold"
                    value={formData.participantLimit || ""}
                    onChange={(e) => setFormData({ ...formData, participantLimit: e.target.value ? Number(e.target.value) : "" })}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Descrição do Encontro</label>
                  <textarea 
                    placeholder="Quais capítulos serão debatidos? Algum ponto de atenção?" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold min-h-[100px] resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1 block mb-3">Formato de Sincronização</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFormData({ ...formData, type: "ONLINE" })}
                      className={cn(
                        "flex-1 py-5 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all",
                        formData.type === "ONLINE" ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5" : "border-white/5 text-neutral-500 hover:border-white/10"
                      )}
                    >
                      Plataforma Online
                    </button>
                    <button 
                      onClick={() => setFormData({ ...formData, type: "PRESENTIAL" })}
                      className={cn(
                        "flex-1 py-5 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all",
                        formData.type === "PRESENTIAL" ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5" : "border-white/5 text-neutral-500 hover:border-white/10"
                      )}
                    >
                      Encontro Presencial
                    </button>
                  </div>
                </div>

                {formData.type === "ONLINE" ? (
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Link de Transmissão</label>
                    <input 
                      type="text" 
                      placeholder="Ex: https://meet.google.com/abc-defg-hij" 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Endereço do Encontro</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Livraria da Vila, Av. Paulista, 1000" 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary/50 transition-all font-bold"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <Button 
                fullWidth 
                className="mt-10 py-6 font-black bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                disabled={createEventMutation.isPending || !formData.title || !formData.clubId || !formData.date}
                onClick={handleCreate}
              >
                {createEventMutation.isPending ? "PUBLICANDO..." : "PUBLICAR EVENTO AGORA"}
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!events || events.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white/2 rounded-[3rem] border-2 border-dashed border-white/5">
            <Calendar className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
            <p className="text-neutral-500 font-bold uppercase tracking-widest">Nenhum evento detectado no radar.</p>
          </div>
        ) : events.map((event: any) => {
          const date = new Date(event.date || Date.now());
          const isConfirmed = (event.rsvpCount || 0) >= 3;

          return (
            <Card key={event.id} className="p-0 border-white/5 overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-[2.5rem] bg-white/2">
              <div className="flex flex-col">
                {/* Status Bar */}
                <div className={cn(
                  "h-2 w-full",
                  isConfirmed ? "bg-emerald-500" : "bg-amber-500"
                )} />

                <div className="p-8 md:p-10 flex gap-8">
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center bg-white/5 rounded-[2rem] w-24 h-28 border border-white/10 shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500 shadow-xl">
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                    <span className="text-4xl font-black text-white">{date.getDate()}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight truncate">{event.title}</h3>
                      <div className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                        isConfirmed ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {isConfirmed ? "Confirmado" : `Pendente (${event.rsvpCount || 0}/3)`}
                      </div>
                    </div>
                    
                    <p className="text-sm font-bold text-neutral-500 mb-6 uppercase tracking-widest">
                      Clube: <span className="text-secondary font-black">{event.clubName || "Global"}</span>
                    </p>

                    <div className="flex flex-wrap gap-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest">
                        <Clock size={16} className="text-primary" /> 
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest">
                        <MapPin size={16} className="text-emerald-400" /> 
                        {event.type === 'online' ? 'Online' : (event.location || "A Definir")}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest">
                        <Users size={16} className="text-secondary" /> 
                        {event.rsvpCount || 0} LEITORES
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-8 bg-white/2 border-t border-white/5 flex gap-4 mt-2">
                  <Button 
                    variant={event.isGoing ? "outline" : "primary"}
                    fullWidth
                    onClick={() => handleToggleRsvp(event.id)}
                    className={cn(
                      "font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs",
                      !event.isGoing && "bg-gradient-to-r from-primary to-secondary text-white border-none shadow-xl shadow-primary/20"
                    )}
                  >
                    {event.isGoing ? (
                      <span className="flex items-center justify-center gap-2 text-emerald-400"><CheckCircle size={18} /> PRESENÇA CONFIRMADA</span>
                    ) : (
                      "EU VOU PARTICIPAR"
                    )}
                  </Button>
                  <Button variant="ghost" className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all">
                    <ExternalLink size={24} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
