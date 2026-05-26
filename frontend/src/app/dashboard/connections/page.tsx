"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Search, 
  MessageCircle,
  TrendingUp,
  UserMinus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { userService } from "@/services";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<"following" | "followers" | "discovery">("following");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["following"],
    queryFn: () => userService.getFollowing(),
  });

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers"],
    queryFn: () => userService.getFollowers(),
  });

  const { data: discovery, isLoading: isLoadingDiscovery } = useQuery({
    queryKey: ["discovery", searchQuery],
    queryFn: () => userService.search(searchQuery),
    enabled: activeTab === "discovery",
  });

  const followMutation = useMutation({
    mutationFn: (id: string) => userService.follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["discovery"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (id: string) => userService.unfollow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  const renderUserCard = (user: any, isFollowing: boolean) => {
    const isMutualFriend = following?.some((f: any) => f.id === user.id) && followers?.some((f: any) => f.id === user.id);
    
    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "glass-card p-6 border-white/5 transition-all group relative overflow-hidden",
          isMutualFriend 
            ? "hover:border-emerald-500/30 shadow-lg shadow-emerald-500/2" 
            : "hover:border-primary/30"
        )}
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users size={80} className={isMutualFriend ? "text-emerald-400" : "text-primary"} />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Avatar user={user} className={cn("w-16 h-16 border-2 group-hover:border-opacity-100 transition-colors", isMutualFriend ? "border-emerald-500/20 group-hover:border-emerald-400" : "border-primary/20 group-hover:border-primary")} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-white font-black text-lg truncate uppercase tracking-tighter leading-none">
                {user.username}
              </h4>
              {isMutualFriend && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  ✨ Amigo
                </span>
              )}
            </div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest leading-none mb-2">
              Nível {user.level || 1}
            </p>
            <p className="text-neutral-400 text-sm line-clamp-1 font-medium italic">
              {user.bio || "Leitor curioso..."}
            </p>
          </div>
        </div>

      <div className="flex items-center gap-2 mt-6 relative z-10">
        {isFollowing ? (
          <Button 
            variant="outline"
            className="flex-1 rounded-xl bg-white/5 border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all font-bold text-xs"
            onClick={() => unfollowMutation.mutate(user.id)}
            disabled={unfollowMutation.isPending}
          >
            <UserMinus className="w-4 h-4 mr-2" /> SEGUINDO
          </Button>
        ) : (
          <Button 
            className="flex-1 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all font-black text-xs"
            onClick={() => followMutation.mutate(user.id)}
            disabled={followMutation.isPending}
          >
            <UserPlus className="w-4 h-4 mr-2" /> SEGUIR
          </Button>
        )}
        <Link href={`/dashboard/chat?receiverId=${user.id}`} className="block">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 group/chat">
            <MessageCircle className="w-5 h-5 group-hover/chat:scale-110 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">COMUNIDADE</h1>
          <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Conexões Literárias</p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
          <button 
            onClick={() => setActiveTab("following")}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
              activeTab === "following" ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-neutral-500 hover:text-white"
            )}
          >
            Seguindo
          </button>
          <button 
            onClick={() => setActiveTab("followers")}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
              activeTab === "followers" ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-neutral-500 hover:text-white"
            )}
          >
            Seguidores
          </button>
          <button 
            onClick={() => setActiveTab("discovery")}
            className={cn(
              "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
              activeTab === "discovery" ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "text-neutral-500 hover:text-white"
            )}
          >
            Descobrir
          </button>
        </div>
      </div>

      {/* Discovery Search */}
      {activeTab === "discovery" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Buscar por usuários, autores ou gêneros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none font-bold italic"
          />
        </motion.div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {activeTab === "following" && (
            isLoadingFollowing ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)
            ) : following?.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                 <Users className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                 <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Você ainda não segue ninguém.</p>
                 <Button variant="ghost" className="mt-4 text-primary" onClick={() => setActiveTab("discovery")}>Explorar Comunidade</Button>
              </div>
            ) : following?.map((u: any) => renderUserCard(u, true))
          )}

          {activeTab === "followers" && (
            isLoadingFollowers ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)
            ) : followers?.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                 <Users className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                 <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Você ainda não tem seguidores.</p>
              </div>
            ) : followers?.map((u: any) => renderUserCard(u, following?.some((f: any) => f.id === u.id)))
          )}

          {activeTab === "discovery" && (
            isLoadingDiscovery ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)
            ) : discovery?.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                 <Search className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                 <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Nenhum leitor encontrado.</p>
              </div>
            ) : discovery?.map((u: any) => renderUserCard(u, following?.some((f: any) => f.id === u.id)))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
