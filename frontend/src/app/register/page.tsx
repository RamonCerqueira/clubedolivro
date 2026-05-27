"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Sparkles,
  Camera,
  Target,
  ChevronLeft,
  Star,
  Book,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

// Lazy load PortalScene to prevent SSR issues
const PortalScene = React.lazy(() => import("@/components/three/PortalScene"));

const GENRES = [
  { id: "ficcao", label: "Ficção Científica", icon: "🚀" },
  { id: "fantasia", label: "Fantasia Épica", icon: "⚔️" },
  { id: "romance", label: "Romance", icon: "💖" },
  { id: "suspense", label: "Suspense / Thriller", icon: "🕵️" },
  { id: "biografia", label: "Biografias", icon: "📖" },
  { id: "negocios", label: "Negócios / Carreira", icon: "📈" },
  { id: "terror", label: "Terror / Horror", icon: "👻" },
  { id: "tecido", label: "Desenvolvimento", icon: "🧠" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
    interests: [] as string[],
    goal: "moderado", // tranquilo, moderado, voraz
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPortal, setShowPortal] = useState(false);
  
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id) 
        : [...prev.interests, id]
    }));
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { access_token } = await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.email.split('@')[0],
        bio: formData.bio,
        city: "São Paulo", // Default or could be added to form
        interests: formData.interests,
      });
      
      // Get the profile after registration to have the full user object
      const userProfile = await authService.getProfile();
      
      setAuth(userProfile, access_token);
      
      // Show magical portal
      setShowPortal(true);
      
      // Redirect after animation completes
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 3500);

    } catch (error: any) {
      console.error("Registration failed", error);
      const msg = error.response?.data?.message || "Erro de conexão com o servidor. Verifique sua internet.";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  // If registration succeeded, show the immersive portal
  if (showPortal) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black text-2xl uppercase">Criando magia...</div>}>
        <PortalScene />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/bg-book-club.png')" }}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg z-0" />
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[180px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-5 gap-10 items-start z-10">
        
        {/* Progress Sidebar - Desktop */}
        <div className="hidden md:flex flex-col gap-8 col-span-2 pt-10">
          <div className="flex items-center gap-3 text-primary font-black text-3xl mb-4">
             <Image src="/logo.png" alt="Leituri" width={48} height={48} className="rounded-2xl shadow-lg object-contain" />
             Leituri
          </div>
          
          <div className="space-y-6">
            {[
              { s: 1, title: "Credenciais", desc: "Acesso à plataforma" },
              { s: 2, title: "Perfil", desc: "Sua identidade única" },
              { s: 3, title: "Gostos", desc: "Seu DNA literário" },
              { s: 4, title: "Metas", desc: "Seu ritmo de leitura" }
            ].map((item) => (
              <div key={item.s} className={cn(
                "flex items-center gap-4 transition-all duration-500",
                step >= item.s ? "opacity-100" : "opacity-30 scale-95 origin-left"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all",
                  step === item.s ? "bg-primary text-white shadow-lg shadow-primary/30" : 
                  step > item.s ? "bg-green-500 text-white" : "bg-white/5 text-neutral-500"
                )}>
                  {step > item.s ? <CheckCircle size={18} /> : item.s}
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">{item.title}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 glass rounded-3xl border border-white/5">
             <Star className="text-amber-400 mb-4" />
             <p className="text-sm text-neutral-400 font-medium leading-relaxed italic">
               "Junte-se a mais de 10.000 leitores e transforme sua rotina com gamificação e comunidade."
             </p>
          </div>
        </div>

        {/* Form Area */}
        <Card className="col-span-3 p-8 md:p-12 glass-card border-white/10 shadow-3xl min-h-[600px] flex flex-col relative">
           {/* Steps Content */}
           <AnimatePresence mode="wait">
             <motion.div
               key={step}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex-1"
             >
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Crie sua Conta</h2>
                      <p className="text-neutral-500 font-medium">O primeiro passo para sua nova vida literária.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">E-mail Profissional</label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" size={20} />
                           <input 
                              type="email" 
                              placeholder="ex: voce@leitor.com"
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-bold"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Senha de Acesso</label>
                         <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" size={20} />
                           <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Mínimo 8 caracteres"
                              className="w-full bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl py-5 pl-14 pr-14 text-white outline-none focus:border-primary/50 transition-all font-bold"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                           />
                           <button 
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors"
                           >
                             {showPassword ? <BookOpen size={20} /> : <Book size={20} />}
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Sua Identidade</h2>
                      <p className="text-neutral-500 font-medium">Como o mundo deve te reconhecer aqui?</p>
                    </div>

                    <div className="flex flex-col items-center gap-6 mb-8">
                       <div className="relative group">
                          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 to-secondary/10 border-2 border-dashed border-white/10 flex items-center justify-center text-neutral-600 group-hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                             {formData.fullName ? (
                               <Avatar user={{ username: formData.fullName }} size="xl" />
                             ) : (
                               <Camera size={40} />
                             )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-black">
                             <Sparkles size={16} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Nome Completo</label>
                        <input 
                           type="text" 
                           placeholder="Ex: Machado de Assis"
                           className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary/50 transition-all font-bold"
                           value={formData.fullName}
                           onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Bio Curta (Opcional)</label>
                        <textarea 
                           placeholder="Conte um pouco sobre suas leituras..."
                           className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary/50 transition-all font-bold min-h-[100px] resize-none"
                           value={formData.bio}
                           onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Seu Radar</h2>
                      <p className="text-neutral-500 font-medium">Selecione pelo menos 3 gêneros de interesse.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                       {GENRES.map(genre => (
                         <button
                           key={genre.id}
                           onClick={() => toggleInterest(genre.id)}
                           className={cn(
                             "flex items-center gap-4 p-5 rounded-3xl border-2 transition-all active:scale-95 text-left group",
                             formData.interests.includes(genre.id)
                               ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                               : "border-white/5 bg-white/2 hover:border-white/10"
                           )}
                         >
                            <span className="text-2xl">{genre.icon}</span>
                            <div className="flex-1">
                               <p className={cn("font-black text-sm uppercase tracking-tight", formData.interests.includes(genre.id) ? "text-primary" : "text-neutral-400")}>
                                 {genre.label}
                               </p>
                            </div>
                            {formData.interests.includes(genre.id) && <CheckCircle size={20} className="text-primary" />}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Sua Ambição</h2>
                      <p className="text-neutral-500 font-medium">Qual seu objetivo de leitura para este ano?</p>
                    </div>

                    <div className="space-y-4">
                       {[
                         { id: "tranquilo", title: "Leitor Tranquilo", desc: "1 a 6 livros por ano - sem pressa.", icon: <BookOpen className="text-green-400" /> },
                         { id: "moderado", title: "Leitor Moderado", desc: "1 a 2 livros por mês - focado.", icon: <Target className="text-primary" /> },
                         { id: "voraz", title: "Leitor Voraz", desc: "1 livro por semana ou mais - insaciável.", icon: <Sparkles className="text-secondary" /> }
                       ].map(goal => (
                         <button
                           key={goal.id}
                           onClick={() => setFormData({...formData, goal: goal.id})}
                           className={cn(
                             "w-full flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all text-left",
                             formData.goal === goal.id ? "border-primary bg-primary/10" : "border-white/5 bg-white/2 hover:border-white/10"
                           )}
                         >
                            <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-2xl shadow-inner uppercase">
                               {goal.icon}
                            </div>
                            <div className="flex-1">
                               <h4 className={cn("font-black text-xl uppercase tracking-tighter", formData.goal === goal.id ? "text-primary" : "text-white")}>
                                 {goal.title}
                               </h4>
                               <p className="text-neutral-500 text-sm font-medium">{goal.desc}</p>
                            </div>
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                              formData.goal === goal.id ? "border-primary bg-primary" : "border-white/10"
                            )}>
                               {formData.goal === goal.id && <CheckCircle size={14} className="text-white" />}
                            </div>
                         </button>
                       ))}
                    </div>

                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl mt-8">
                       <p className="text-sm text-primary/80 font-bold leading-relaxed">
                         🎉 Receberemos você com 500 XP de bônus por completar este cadastro rico!
                       </p>
                    </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>

           {/* Error Message Display */}
           {errorMessage && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
             >
               <AlertCircle size={20} />
               <p className="font-bold text-sm">{errorMessage}</p>
             </motion.div>
           )}

           {/* Footer Action */}
           <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              {step > 1 ? (
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-neutral-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} /> Voltar
                </button>
              ) : (
                <Link href="/login" className="text-neutral-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
                  Já tenho conta
                </Link>
              )}

              <div className="flex items-center gap-6">
                <div className="flex gap-1.5">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={cn("h-1 rounded-full transition-all duration-500", step === i ? "w-8 bg-primary" : "w-1 bg-white/10")} />
                   ))}
                </div>

                {step < 4 ? (
                  <Button 
                    onClick={handleNext}
                    className="rounded-full px-10 h-16 bg-white text-black font-black hover:bg-neutral-200"
                    disabled={step === 1 && (!formData.email || !formData.password)}
                  >
                    CONTINUAR <ArrowRight className="ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegister}
                    disabled={loading}
                    className="rounded-full px-12 h-16 bg-gradient-to-r from-primary to-secondary text-white font-black shadow-2xl shadow-primary/30"
                  >
                    {loading ? "CRIANDO..." : "FINALIZAR"} <CheckCircle className="ml-2" />
                  </Button>
                )}
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
