"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle, 
  MapPin, 
  Compass, 
  Users,
  Target,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { userService, clubService } from "@/services";

const INTERESTS = [
  "Ficção Científica", "Romance", "Fantasia", "Clássicos", 
  "Tecnologia", "História", "Suspense", "Desenvolvimento Pessoal",
  "Terror", "Poesia", "Biografia", "Negócios", "Anime & Mangá"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", city: "São Paulo" });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

  const { updateUser } = useAuthStore();
  const router = useRouter();

  const { data: clubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ["clubs-recommendations"],
    queryFn: () => clubService.getAll(),
    enabled: step === 3
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => userService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      router.push("/dashboard");
    }
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleFinish = async () => {
    updateProfileMutation.mutate({ 
      name: formData.name, 
      city: formData.city,
      interests: selectedInterests 
    });
  };

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleToggleClub = (id: string) => {
    setSelectedClubs((prev) => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.05, y: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-mesh opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[140px]" />

      <Card className="max-w-2xl w-full p-8 md:p-16 shadow-3xl relative overflow-hidden min-h-[650px] flex flex-col bg-[#0a0a0c] border border-white/5 rounded-[3rem]">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-10 border border-primary/20 shadow-2xl shadow-primary/10">
                <Compass size={40} />
              </div>
              <h1 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Primeiros passos.</h1>
              <p className="text-neutral-500 mb-12 text-lg font-medium italic">"Toda grande aventura começa com um nome nas páginas do destino."</p>
              
              <div className="space-y-10">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 block mb-4 transition-colors group-focus-within:text-primary">Seu Codinome / Nome Público</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Biblioteconomista" 
                    className="w-full px-8 py-6 rounded-2xl bg-black/40 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg font-bold text-white placeholder:text-neutral-800"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 block mb-4">Sua Base de Operações</label>
                  <div className="relative">
                    <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={24} />
                    <select 
                      className="w-full pl-20 pr-8 py-6 rounded-2xl bg-black/40 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none appearance-none cursor-pointer text-lg font-bold text-white"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option className="bg-neutral-900">São Paulo</option>
                      <option className="bg-neutral-900">Rio de Janeiro</option>
                      <option className="bg-neutral-900">Belo Horizonte</option>
                      <option className="bg-neutral-900">Curitiba</option>
                      <option className="bg-neutral-900">Global (Remoto)</option>
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-neutral-700 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8 border border-secondary/20">
                <Target size={32} />
              </div>
              <h1 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Seu DNA Literário.</h1>
              <p className="text-neutral-500 mb-10 text-lg font-medium">Escolha pelo menos 3 gêneros que definem seu paladar intelectual.</p>
              
              <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto max-h-[380px] pr-4 custom-scrollbar">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleToggleInterest(interest)}
                    className={cn(
                      "px-6 py-5 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all active:scale-95 text-left flex justify-between items-center group",
                      selectedInterests.includes(interest) 
                        ? "border-primary bg-primary/10 text-primary shadow-2xl shadow-primary/10" 
                        : "border-white/5 bg-white/2 text-neutral-600 hover:border-white/20 hover:text-neutral-300"
                    )}
                  >
                    {interest}
                    {selectedInterests.includes(interest) && <CheckCircle size={18} className="animate-in zoom-in duration-300" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              <div className="w-16 h-16 bg-white/5 text-white rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Users size={32} />
              </div>
              <h1 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Encontre sua tribo.</h1>
              <p className="text-neutral-500 mb-10 text-lg font-medium">Baseado no seu DNA, aqui estão as comunidades mais compatíveis.</p>
              
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-4 custom-scrollbar">
                {isLoadingClubs ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Sincronizando Frequências...</p>
                  </div>
                ) : clubs?.length > 0 ? clubs.map((club: any) => (
                  <div 
                    key={club.id} 
                    onClick={() => handleToggleClub(club.id)}
                    className={cn(
                      "p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex items-center justify-between group bg-white/2",
                      selectedClubs.includes(club.id)
                        ? "border-primary bg-primary/5 shadow-2xl shadow-primary/5"
                        : "border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black text-2xl text-primary group-hover:scale-110 transition-transform">
                            {club.name.charAt(0)}
                        </div>
                        <div>
                        <h3 className={cn("font-black text-xl uppercase tracking-tight", selectedClubs.includes(club.id) ? "text-primary" : "text-white")}>
                            {club.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] text-neutral-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin size={12} className="text-emerald-500" /> {club.city || "Global"}
                            </span>
                            <span className="text-[10px] text-neutral-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Users size={12} className="text-secondary" /> {club.membersCount || 0} LEITORES
                            </span>
                        </div>
                        </div>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                      selectedClubs.includes(club.id) ? "bg-primary border-primary text-white" : "border-white/10 group-hover:border-white/30"
                    )}>
                      {selectedClubs.includes(club.id) && <CheckCircle size={20} />}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-30">
                    <p className="text-xs font-black uppercase tracking-widest">Nenhuma tribo detectada ainda.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-12 pt-12 border-t border-white/5 flex justify-between items-center bg-transparent">
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  step === i ? "bg-primary w-16 shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-white/10 w-4"
                )} 
              />
            ))}
          </div>

          <div className="flex gap-6">
            {step > 1 && (
              <Button variant="ghost" className="rounded-2xl px-10 text-neutral-600 hover:text-white" onClick={() => setStep(s => s - 1)}>
                VOLTAR
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                disabled={(step === 1 && !formData.name) || (step === 2 && selectedInterests.length < 3)} 
                onClick={handleNext}
                className="rounded-2xl px-12 bg-white text-black font-black hover:scale-105 transition-transform uppercase tracking-widest text-xs h-16"
              >
                PRÓXIMO <ChevronRight size={20} className="ml-2" />
              </Button>
            ) : (
              <Button 
                disabled={updateProfileMutation.isPending}
                className="rounded-2xl px-14 bg-gradient-to-r from-primary to-secondary text-white font-black shadow-2xl shadow-primary/20 hover:scale-105 transition-transform uppercase tracking-widest text-xs h-16"
                onClick={handleFinish}
              >
                {updateProfileMutation.isPending ? <Loader2 className="animate-spin" /> : <>INICIAR JORNADA <CheckCircle size={20} className="ml-2" /></>}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
