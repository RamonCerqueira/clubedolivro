"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Trophy, 
  Award, 
  BookMarked, 
  MapPin, 
  Calendar,
  Zap,
  Loader2,
  Lock,
  Flame,
  BookOpen,
  Compass,
  Crown,
  UserPlus,
  UserMinus,
  MessageSquare
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { userService, gamificationService } from "@/services";

interface BadgeType {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  check: (user: any) => { unlocked: boolean; progress: number; target: number };
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const { data: profile, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  // Redirect to my profile if this is me
  useEffect(() => {
    if (profile && currentUser && profile.id === currentUser.id) {
      router.replace("/dashboard/profile");
    }
  }, [profile, currentUser, router]);

  const followMutation = useMutation({
    mutationFn: () => userService.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Sincronizando Identidade...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Usuário não encontrado</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  // Check if following
  const isFollowing = currentUser?.following?.some((u: any) => u.id === userId) || false;

  const xpNeeded = (profile.level || 1) * 100;
  const xpProgress = ((profile.points || 0) / xpNeeded) * 100;

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Profile Header */}
      <Card className="p-0 border-white/5 overflow-hidden group">
        <div className="h-40 md:h-64 bg-gradient-to-r from-indigo-950 via-purple-950 to-primary/40 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)] opacity-20" />
        </div>
        
        <div className="px-6 md:px-12 pb-12 relative">
          <div className="flex flex-col md:flex-row gap-8 items-end -mt-16 md:-mt-20">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-40 transition-opacity" />
              <div className="relative p-1.5 bg-background rounded-full">
                <Avatar user={profile} size="xl" className="w-32 h-32 md:w-44 md:h-44 border-4 border-surface" />
              </div>
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-primary to-secondary border-4 border-background rounded-full flex items-center justify-center text-white shadow-xl">
                 <Zap size={18} fill="currentColor" className="animate-pulse" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-white">{profile.username}</h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <span className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-widest">NÍVEL: {profile.level}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-neutral-400 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> Membro desde {new Date(profile.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400" /> {profile.city || "Clube da Leitura"}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {isFollowing ? (
                <Button 
                  onClick={() => unfollowMutation.mutate()}
                  disabled={unfollowMutation.isPending}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 font-black shadow-lg"
                >
                  <UserMinus size={20} className="mr-2" /> Deixar de Seguir
                </Button>
              ) : (
                <Button 
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 font-black shadow-lg shadow-primary/20"
                >
                  <UserPlus size={20} className="mr-2" /> Seguir Leitor
                </Button>
              )}
              <Button 
                onClick={() => router.push(`/dashboard/chat?receiverId=${userId}`)}
                variant="secondary" 
                className="flex-1 md:flex-none py-4 px-6 rounded-2xl"
              >
                <MessageSquare size={20} />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-neutral-300 text-center md:text-left max-w-2xl text-md leading-relaxed">
            {profile.bio || "Este leitor prefere o mistério e ainda não revelou sua biografia."}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
            {profile.interests?.map((i: string) => (
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
                  <span>NÍVEL {profile.level}</span>
                  <span className="text-primary">{xpProgress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_8px_rgba(80,70,229,0.5)]"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  {profile.points} / {xpNeeded} XP acumulados
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
                const { unlocked, progress, target } = badge.check(profile);
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

        {/* Lado Direito: Clubes participando */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-white/5 bg-surface h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <BookMarked className="text-secondary" size={22} /> Clubes Participando
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.memberships?.length > 0 ? profile.memberships.map((membership: any) => (
                <motion.div 
                  key={membership.id} 
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/dashboard/clubs/${membership.club.id}`)}
                  className="p-4 rounded-2xl border border-white/5 bg-zinc-950/40 hover:border-primary/50 transition-all cursor-pointer flex gap-4 items-center"
                >
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl shadow-md">
                      🏛️
                   </div>
                   <div className="min-w-0 flex-1">
                     <h4 className="font-bold text-sm text-white truncate uppercase tracking-tight">{membership.club.name}</h4>
                     <p className="text-[10px] text-zinc-500 mt-0.5 font-bold uppercase tracking-wider">{membership.role}</p>
                   </div>
                </motion.div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-30">
                  <Compass size={48} />
                  <p className="mt-4 font-black uppercase text-xs tracking-widest">Nenhum clube associado</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
