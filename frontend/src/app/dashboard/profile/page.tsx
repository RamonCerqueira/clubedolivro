"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, 
  Award, 
  BookMarked, 
  Share2, 
  Settings, 
  MapPin, 
  Calendar,
  Zap,
  Plus,
  ChevronRight,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  Lock,
  Flame,
  BookOpen,
  Compass,
  Crown
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { clubService, bookService, authService, userService, uploadService } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";

interface BadgeType {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  check: (user: any) => { unlocked: boolean; progress: number; target: number };
}

export default function ProfilePage() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareStep, setShareStep] = useState(1);
  const [shareLoading, setShareLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    assumedResponsibility: false,
    postToFeed: true
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editInterests, setEditInterests] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { data: profile, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
  });

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => bookService.getAll(),
  });

  useEffect(() => {
    if (profile) {
      setEditBio(profile.bio || "");
      setEditCity(profile.city || "");
      setEditInterests(profile.interests?.join(", ") || "");
    }
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const res = await uploadService.upload(file);
      const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${res.url}`;
      await userService.updateProfile({ avatar: avatarUrl });
      useAuthStore.getState().updateUser({ avatar: avatarUrl });
      refetch();
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const interestsArray = editInterests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await userService.updateProfile({
        bio: editBio,
        city: editCity,
        interests: interestsArray,
      });

      useAuthStore.getState().updateUser({
        bio: editBio,
        city: editCity,
        interests: interestsArray,
      });

      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Gatilho de comemoração de subida de nível
  useEffect(() => {
    if (profile && profile.points === 0 && profile.level > 1) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [profile?.level]);

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Sincronizando Identidade...</p>
      </div>
    );
  }

  const userProfile = profile || {
    name: "Leitor",
    username: "@leitor",
    city: "Não informada",
    bio: "Bio não disponível",
    level: 1,
    points: 0,
    createdAt: new Date().toISOString(),
    interests: [],
    achievements: [],
    memberships: [],
    _count: { memberships: 0 }
  };

  const xpNeeded = (userProfile.level || 1) * 100;
  const xpProgress = ((userProfile.points || 0) / xpNeeded) * 100;

  // Definição dos Badges Gamificados
  const BADGES: BadgeType[] = [
    {
      type: "FIRST_STEPS",
      title: "Primeiros Passos",
      description: "Registrou sua primeira leitura no Diário de Bordo.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-500",
      check: (user) => {
        const has = user.achievements?.some((a: any) => a.type === "FIRST_STEPS");
        return { unlocked: has, progress: has ? 1 : 0, target: 1 };
      }
    },
    {
      type: "DEEP_READER",
      title: "Devorador de Livros",
      description: "Superou a marca de 500 páginas lidas no Diário.",
      icon: <Flame className="w-6 h-6" />,
      color: "from-orange-400 to-red-500",
      check: (user) => {
        const ach = user.achievements?.find((a: any) => a.type === "DEEP_READER");
        return { 
          unlocked: !!ach, 
          progress: ach ? ach.progress : 0, 
          target: 500 
        };
      }
    },
    {
      type: "PIONEER",
      title: "Desbravador Literário",
      description: "Criou ou associou-se a pelo menos 1 clube do livro.",
      icon: <Compass className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      check: (user) => {
        const count = user.memberships?.length || user._count?.memberships || 0;
        return { unlocked: count > 0, progress: count, target: 1 };
      }
    },
    {
      type: "LEVEL_10",
      title: "Sábio Literário",
      description: "Alcançou o nível 10 evoluindo suas leituras cotidianas.",
      icon: <Crown className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      check: (user) => {
        const lvl = user.level || 1;
        return { unlocked: lvl >= 10, progress: lvl, target: 10 };
      }
    }
  ];

  const handleShareBook = async () => {
    setShareLoading(true);
    try {
      await bookService.create({
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        categories: ["Literatura"],
      });
      
      if (bookData.postToFeed) {
        await clubService.createPost(`📚 Estou compartilhando o livro "${bookData.title}"! Veja agora na minha estante digital.`);
      }
      
      setShareStep(3);
    } catch (error) {
      console.error("Error sharing book", error);
    } finally {
      setShareLoading(false);
    }
  };

  const celebrateClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* EFEITO CONFETI NEON INTERATIVO */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 3;
            const randomScale = 0.5 + Math.random() * 1;
            const colors = ["#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <motion.div
                key={i}
                initial={{ y: -50, x: `${randomX}vw`, rotate: 0, opacity: 1 }}
                animate={{ 
                  y: "105vh", 
                  x: `${randomX + (Math.random() * 20 - 10)}vw`,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  opacity: 0
                }}
                transition={{ 
                  duration: 2.5 + Math.random() * 2, 
                  delay: randomDelay,
                  ease: "linear"
                }}
                className="absolute w-3.5 h-3.5 rounded-full"
                style={{ 
                  backgroundColor: randomColor, 
                  scale: randomScale,
                  boxShadow: `0 0 10px ${randomColor}`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Profile Header */}
      <Card className="p-0 border-white/5 overflow-hidden group">
        <div className="h-40 md:h-64 bg-gradient-to-r from-primary via-secondary to-indigo-900 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)] opacity-20" />
        </div>
        
        <div className="px-6 md:px-12 pb-12 relative">
          <div className="flex flex-col md:flex-row gap-8 items-end -mt-16 md:-mt-20">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-40 group-hover/avatar:opacity-60 transition-opacity" />
              <div className="relative p-1.5 bg-background rounded-full cursor-pointer overflow-hidden rounded-full">
                <Avatar user={userProfile} size="xl" className="w-32 h-32 md:w-44 md:h-44 border-4 border-surface" />
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer rounded-full">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-center px-1">Mudar</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={isUploadingAvatar} />
                </label>
              </div>
              <div 
                onClick={celebrateClick}
                className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary to-secondary border-4 border-background rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all"
              >
                 <Zap size={18} fill="currentColor" className="animate-pulse" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-white">{userProfile.username}</h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <span className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-widest">NÍVEL: {userProfile.level}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-neutral-400 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Membro desde {new Date(userProfile.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400" /> {userProfile.city || "Clube da Leitura"}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 font-black shadow-lg shadow-primary/20"
              >
                <Plus size={20} /> Compartilhar Livro
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 md:flex-none py-4 px-6 rounded-2xl"
              >
                <Settings size={20} />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-neutral-300 text-center md:text-left max-w-2xl text-md leading-relaxed">
            {userProfile.bio || "Este leitor prefere o mistério e ainda não revelou sua biografia."}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
            {userProfile.interests?.map((i: string) => (
               <span key={i} className="bg-primary/10 text-primary text-[10px] font-black px-4 py-2 rounded-xl border border-primary/20 uppercase tracking-widest">{i}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Gamificação (Progresso & Badges) */}
        <div className="space-y-6 col-span-1">
          
          {/* XP Progress Card */}
          <Card className="p-6 border-white/5 bg-surface group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
             <h3 className="text-md font-display font-bold text-white mb-5 flex items-center gap-2">
               <Trophy className="text-yellow-500 animate-bounce" size={20} /> Progresso de XP
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  <span>NÍVEL {userProfile.level}</span>
                  <span className="text-primary">{xpProgress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 cursor-pointer" onClick={celebrateClick}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_8px_rgba(80,70,229,0.5)]"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  {userProfile.points} / {xpNeeded} XP acumulados neste nível
                </p>
             </div>
          </Card>

          {/* VITRINE DE CONQUISTAS (BADGES) DINÂMICA */}
          <Card className="p-6 border-white/5 bg-surface">
            <h3 className="text-md font-display font-bold text-white mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="text-secondary" size={20} /> Vitrine de Conquistas
            </h3>
            
            <div className="space-y-4">
              {BADGES.map((badge) => {
                const { unlocked, progress, target } = badge.check(userProfile);
                const percent = Math.min(100, Math.round((progress / target) * 100));
                return (
                  <div 
                    key={badge.type} 
                    className={cn(
                      "p-3 rounded-2xl border flex gap-3.5 items-start transition-all duration-300 relative group/badge overflow-hidden",
                      unlocked 
                        ? "bg-zinc-950/60 border-white/10 hover:border-primary/40" 
                        : "bg-zinc-950/20 border-white/5 opacity-50"
                    )}
                  >
                    {/* Glowing BG on hover */}
                    {unlocked && (
                      <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-gradient-to-tr from-primary/10 to-secondary/10 blur-xl rounded-full opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none" />
                    )}

                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg relative",
                      unlocked ? `bg-gradient-to-br ${badge.color}` : "bg-zinc-800"
                    )}>
                      {unlocked ? badge.icon : <Lock className="w-5 h-5 text-zinc-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs text-white truncate">{badge.title}</h4>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                          {progress}/{target}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                        {badge.description}
                      </p>

                      {/* Progresso do Badge */}
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            unlocked ? "bg-gradient-to-r from-primary to-secondary" : "bg-zinc-700"
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Lado Direito: Estante */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-white/5 bg-surface h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <BookMarked className="text-secondary animate-pulse" size={22} /> Estante Pública
              </h3>
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary">Ver Tudo</Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {isBooksLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : books?.length > 0 ? books.map((book: any) => (
                <motion.div 
                  key={book.id} 
                  whileHover={{ y: -4 }}
                  className="flex flex-col group cursor-pointer"
                >
                   <div className="aspect-[3/4] bg-white/5 rounded-2xl shadow-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-all">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl mb-2 drop-shadow-2xl">📚</span>
                      )}
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-3 text-center transition-all duration-300">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Livro Ativo</span>
                        <p className="text-xs font-black text-white line-clamp-2 uppercase tracking-tight leading-tight">{book.title}</p>
                        <p className="text-[9px] text-zinc-400 mt-1 font-bold truncate max-w-full">{book.author}</p>
                      </div>
                   </div>
                   <p className="text-xs font-bold text-white mt-2.5 text-center line-clamp-1 uppercase tracking-tight group-hover:text-primary transition-colors">{book.title}</p>
                   <p className="text-[9px] font-bold text-neutral-500 text-center mt-0.5">{book.author}</p>
                </motion.div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-30">
                  <BookMarked size={48} />
                  <p className="mt-4 font-black uppercase text-xs tracking-widest">Estante Vazia</p>
                </div>
              )}
              <div 
                onClick={() => setIsShareModalOpen(true)}
                className="aspect-[3/4] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-neutral-600 hover:border-primary/50 hover:text-primary transition-all cursor-pointer bg-white/2 hover:bg-primary/5"
              >
                 <Plus size={28} />
                 <span className="text-[9px] font-black uppercase tracking-widest mt-2">Adicionar</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SHARE BOOK MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-black text-white tracking-tight uppercase">Compartilhar Obra</h2>
                   <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">Disponibilizar para a rede</p>
                 </div>
                 <button onClick={() => setIsShareModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <div className="p-6 md:p-8">
                {shareStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Título do Livro</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Dom Casmurro"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                          value={bookData.title}
                          onChange={e => setBookData({...bookData, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Autor</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Machado de Assis"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                          value={bookData.author}
                          onChange={e => setBookData({...bookData, author: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Descrição / Sinopse</label>
                      <textarea 
                        placeholder="Conte um pouco sobre esta obra..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold min-h-[100px] resize-none"
                        value={bookData.description}
                        onChange={e => setBookData({...bookData, description: e.target.value})}
                      />
                    </div>

                    <div className="border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group bg-white/2">
                       <Upload className="text-neutral-600 group-hover:text-primary transition-colors mb-2" size={28} />
                       <p className="text-xs font-bold text-white">Anexar PDF do Livro</p>
                       <p className="text-[9px] text-neutral-500 mt-0.5 uppercase tracking-widest font-black">Suporta arquivos até 20MB</p>
                    </div>

                    <Button 
                      fullWidth 
                      disabled={!bookData.title || !bookData.author}
                      onClick={() => setShareStep(2)}
                      className="py-4 bg-primary text-white font-black rounded-xl"
                    >
                      Continuar <ChevronRight size={18} className="ml-1" />
                    </Button>
                  </div>
                )}

                {shareStep === 2 && (
                  <div className="space-y-6">
                     <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-4">
                        <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-black text-amber-500 text-xs uppercase tracking-tight">Aviso de Responsabilidade</h4>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed font-medium">
                            Ao disponibilizar este livro, você declara possuir os direitos ou que a obra está em domínio público, assumindo total responsabilidade legal pela distribuição do conteúdo na plataforma.
                          </p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                           <input 
                             type="checkbox" 
                             className="w-5 h-5 rounded border-white/10 bg-black text-primary"
                             checked={bookData.assumedResponsibility}
                             onChange={e => setBookData({...bookData, assumedResponsibility: e.target.checked})}
                           />
                           <span className="text-xs font-bold text-white">Eu assumo total responsabilidade por este compartilhamento.</span>
                        </label>

                        <label className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                           <input 
                             type="checkbox" 
                             className="w-5 h-5 rounded border-white/10 bg-black text-primary"
                             checked={bookData.postToFeed}
                             onChange={e => setBookData({...bookData, postToFeed: e.target.checked})}
                           />
                           <span className="text-xs font-bold text-white">Publicar anúncio no feed para todos os usuários.</span>
                        </label>
                     </div>

                     <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => setShareStep(1)} className="flex-1">Voltar</Button>
                        <Button 
                          disabled={!bookData.assumedResponsibility || shareLoading}
                          onClick={handleShareBook}
                          className="flex-[2] bg-primary text-white font-black rounded-xl"
                        >
                          {shareLoading ? "Compartilhando..." : "Confirmar e Postar"}
                        </Button>
                     </div>
                  </div>
                )}

                {shareStep === 3 && (
                  <div className="py-8 flex flex-col items-center text-center space-y-6">
                     <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/10">
                        <CheckCircle size={36} />
                     </div>
                     <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Livro Disponibilizado!</h3>
                       <p className="text-neutral-500 text-xs font-medium mt-2 max-w-xs mx-auto">
                         "{bookData.title}" agora faz parte da sua estante pública e está disponível para a comunidade.
                       </p>
                     </div>
                     <Button 
                      onClick={() => {
                        setIsShareModalOpen(false);
                        setShareStep(1);
                        refetch(); // Atualiza a estante
                      }}
                      className="bg-white text-black font-black px-12 rounded-full"
                     >
                       Concluir
                     </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
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
                   <h2 className="text-xl font-black text-white tracking-tight uppercase">Editar Perfil</h2>
                   <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">Atualizar seus dados de leitor</p>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Cidade / Localização</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Rio de Janeiro, RJ"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Biografia / Apresentação</label>
                  <textarea 
                    placeholder="Conte mais sobre suas paixões literárias..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold min-h-[100px] resize-none"
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Interesses (separados por vírgula)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Romance, Fantasia, Filosofia"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold"
                    value={editInterests}
                    onChange={e => setEditInterests(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    disabled={isUpdatingProfile}
                    onClick={handleSaveProfile}
                    className="flex-[2] bg-primary text-white font-black rounded-xl"
                  >
                    {isUpdatingProfile ? "Salvando..." : "Salvar Alterações"}
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
