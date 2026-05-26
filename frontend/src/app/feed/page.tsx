"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Globe,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { clubService } from "@/services";

export default function FeedPage() {
  const [newPost, setNewPost] = useState("");
  const queryClient = useQueryClient();

  const { data: feed, isLoading } = useQuery({
    queryKey: ["global-feed"],
    queryFn: () => clubService.getGlobalFeed(),
  });

  const createPostMutation = useMutation({
    mutationFn: (content: string) => clubService.createPost(content),
    onSuccess: () => {
      setNewPost("");
      queryClient.invalidateQueries({ queryKey: ["global-feed"] });
    },
  });

  const handlePost = () => {
    if (!newPost.trim()) return;
    createPostMutation.mutate(newPost);
  };

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Globe className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">COMUNIDADE</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Feed Global</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <TrendingUp className="w-5 h-5 text-primary" />
           </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        {/* Create Post */}
        <Card className="p-6 border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Globe size={120} className="text-primary" />
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex-shrink-0 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="O que você está lendo hoje?"
                className="w-full bg-transparent border-none focus:ring-0 text-lg text-white placeholder:text-neutral-500 resize-none min-h-[100px]"
              />
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2 text-neutral-400">
                   <Button variant="ghost" size="icon" className="hover:text-primary">
                     <Plus className="w-5 h-5" />
                   </Button>
                </div>
                <Button 
                  onClick={handlePost}
                  disabled={!newPost.trim() || createPostMutation.isPending}
                  className="rounded-full px-8 bg-primary text-white font-black hover:bg-primary-dark shadow-lg shadow-primary/20"
                >
                  {createPostMutation.isPending ? "Publicando..." : "PUBLICAR"}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed Timeline */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse border-white/5">
                  <div className="flex gap-4 h-24">
                     <div className="w-12 h-12 rounded-2xl bg-white/5" />
                     <div className="flex-1 space-y-4">
                        <div className="h-4 bg-white/5 w-1/3 rounded" />
                        <div className="h-12 bg-white/5 w-full rounded" />
                     </div>
                  </div>
                </Card>
              ))
            ) : feed?.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                <Globe className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium">Nenhuma postagem ainda.<br/>Seja o primeiro a compartilhar algo!</p>
              </div>
            ) : feed?.map((post: any, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-white/20 transition-all duration-300 group shadow-2xl shadow-black/40">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex-shrink-0 overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                      <img 
                        src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} 
                        alt={post.author.username} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-black text-white leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                            {post.author.username}
                          </h4>
                          <div className="flex items-center gap-2">
                              {post.club ? (
                                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                  Clube: {post.club.name}
                                </span>
                              ) : (
                                <span className="text-[10px] text-neutral-500 font-bold bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                  Global
                                </span>
                              )}
                              <span className="text-[10px] text-neutral-500 font-medium">
                                • {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <p className="text-neutral-300 text-lg leading-relaxed mb-6 font-medium">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <button className="flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors group/btn">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-red-500/10 transition-colors">
                            <Heart className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest">0</span>
                        </button>
                        <button className="flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors group/btn">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-primary/10 transition-colors">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest">Responder</span>
                        </button>
                        <div className="flex-1" />
                        <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                          <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
