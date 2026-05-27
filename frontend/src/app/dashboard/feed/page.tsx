"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageSquare, 
  Share2, 
  Send, 
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Globe,
  Plus,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { clubService, authService, uploadService, userService, chatService } from "@/services";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/components/features/FeedCard";

export default function DashboardFeedPage() {
  const [newPost, setNewPost] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"IMAGE" | "VIDEO" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Interactive UI State
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({});
  const [shareModalPostId, setShareModalPostId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"GLOBAL" | "FOLLOWING">("GLOBAL");

  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getProfile(),
  });

  const { data: feed, isLoading } = useQuery({
    queryKey: ["feed", activeTab],
    queryFn: () => activeTab === "GLOBAL" ? clubService.getGlobalFeed() : clubService.getFollowingFeed(),
  });

  // Query following and followers to compute mutual friends for direct sharing
  const { data: following } = useQuery({
    queryKey: ["following"],
    queryFn: () => userService.getFollowing(),
  });

  const { data: followers } = useQuery({
    queryKey: ["followers"],
    queryFn: () => userService.getFollowers(),
  });

  const friends = following?.filter((f: any) => 
    followers?.some((fol: any) => fol.id === f.id)
  ) || [];

  const createPostMutation = useMutation({
    mutationFn: async (payload: { content: string; mediaUrl?: string; mediaType?: string }) => {
      return clubService.createPost(payload.content, undefined, undefined, payload.mediaUrl, payload.mediaType);
    },
    onSuccess: () => {
      setNewPost("");
      setAttachedFile(null);
      setAttachedPreview(null);
      setFileType(null);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (payload: { postId: string; content: string; parentId?: string }) => 
      clubService.commentPost(payload.postId, payload.content, payload.parentId),
    onSuccess: (_, variables) => {
      setNewComments((prev) => ({ ...prev, [variables.postId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => clubService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const clapMutation = useMutation({
    mutationFn: (payload: { postId: string; claps: number }) => 
      clubService.reactPost(payload.postId, payload.claps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: (payload: { friendId: string; postId: string; content: string }) => 
      chatService.sendMessage({
        content: `🔗 [POST COMPARTILHADO] Espreite esta discussão literária:\n"${payload.content.substring(0, 80)}..."\nVisualizar em: /dashboard/feed#post-${payload.postId}`,
        receiverId: payload.friendId
      }),
    onSuccess: () => {
      alert("Post compartilhado com sucesso no chat privado!");
      setShareModalPostId(null);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 8.0) {
          alert("Erro: A duração do vídeo ultrapassa o limite de 8.0 segundos!");
          return;
        }
        setAttachedFile(file);
        setAttachedPreview(URL.createObjectURL(file));
        setFileType("VIDEO");
      };
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("image/")) {
      setAttachedFile(file);
      setAttachedPreview(URL.createObjectURL(file));
      setFileType("IMAGE");
    } else {
      alert("Formato não suportado! Envie imagens ou vídeos.");
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() && !attachedFile) return;

    let mediaUrl = undefined;
    let mediaType = undefined;

    if (attachedFile) {
      setIsUploading(true);
      try {
        const uploadResult = await uploadService.upload(attachedFile);
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.type;
      } catch (err) {
        alert("Erro no upload do arquivo!");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    createPostMutation.mutate({
      content: newPost,
      mediaUrl,
      mediaType,
    });
  };

  const handleClap = (postId: string, currentReactions: any[]) => {
    const myClap = currentReactions?.find((r: any) => r.userId === me?.id);
    const myClapCount = myClap ? myClap.claps : 0;
    const newClapCount = myClapCount > 0 ? 0 : 1;

    clapMutation.mutate({ postId, claps: newClapCount });
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">Comunidade</h1>
          <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">O pulsar da inteligência coletiva</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Leituri Social</span>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="max-w-xl mx-auto flex p-1.5 bg-white/5 border border-white/10 rounded-[1.5rem] relative overflow-hidden backdrop-blur-3xl">
        <button
          onClick={() => setActiveTab("GLOBAL")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.2rem] transition-all relative z-10",
            activeTab === "GLOBAL" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Feed Global
        </button>
        <button
          onClick={() => setActiveTab("FOLLOWING")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.2rem] transition-all relative z-10",
            activeTab === "FOLLOWING" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Seguindo
        </button>
      </div>

      <main className="max-w-xl mx-auto space-y-12">
        {/* Create Post */}
        <Card className="p-6 border-white/5 bg-white/2 relative overflow-hidden group rounded-[2rem] shadow-xl">
          <div className="flex gap-4 relative z-10">
            <div className="flex-shrink-0">
              <Avatar user={me || { username: "..." }} className="w-12 h-12 ring-2 ring-primary/20 bg-black/40" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="O que você está lendo ou pensando hoje?"
                className="w-full bg-transparent border-none focus:ring-0 text-lg text-white placeholder:text-neutral-600 resize-none min-h-[80px] font-medium outline-none"
              />

              {attachedPreview && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-72 flex items-center justify-center bg-black/30">
                  {fileType === "IMAGE" ? (
                    <img src={`http://localhost:3000${attachedPreview.startsWith("blob:") ? attachedPreview : attachedPreview}`} alt="Attached Preview" className="object-cover max-h-72 w-full" />
                  ) : (
                    <video src={attachedPreview} controls muted className="max-h-72 w-full object-cover" />
                  )}
                  <button 
                    onClick={() => {
                      setAttachedFile(null);
                      setAttachedPreview(null);
                      setFileType(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/95 rounded-full text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*,video/*" 
                    className="hidden" 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <ImageIcon size={18} />
                    <span>Mídia</span>
                  </button>
                  {attachedFile && (
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-2.5 rounded-xl font-bold uppercase tracking-wider">
                      Pronto ({fileType})
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handlePost}
                  disabled={(!newPost.trim() && !attachedFile) || createPostMutation.isPending || isUploading}
                  className="rounded-xl px-6 h-11 bg-primary text-white font-bold hover:bg-primary-dark transition-all uppercase tracking-widest text-xs flex items-center gap-2"
                >
                  {createPostMutation.isPending || isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <>PUBLICAR <Send className="w-3.5 h-3.5" /></>}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed Timeline */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse border-white/5 rounded-[2rem] h-96 bg-white/2" />
              ))
            ) : feed?.length === 0 ? (
              <div className="text-center py-20 bg-white/2 rounded-[2rem] border-2 border-dashed border-white/5 opacity-40">
                <Globe className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">O feed global está silencioso por enquanto.</p>
              </div>
            ) : feed?.map((post: any, index: number) => {
              const totalClaps = post.reactions?.reduce((acc: number, curr: any) => acc + curr.claps, 0) || 0;
              const myClap = post.reactions?.find((r: any) => r.userId === me?.id);
              const myClapCount = myClap ? myClap.claps : 0;

              return (
                <FeedCard 
                  key={post.id}
                  post={post}
                  index={index}
                  me={me}
                  totalClaps={totalClaps}
                  myClapCount={myClapCount}
                  handleClap={handleClap}
                  expandedComments={!!expandedComments[post.id]}
                  toggleComments={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  setNewCommentText={(txt) => setNewComments(prev => ({ ...prev, [post.id]: txt }))}
                  submitComment={(parentId) => commentMutation.mutate({ postId: post.id, content: newComments[post.id] || "", parentId })}
                  deleteComment={(cid) => deleteCommentMutation.mutate(cid)}
                  openShareModal={() => setShareModalPostId(post.id)} newCommentText={""}                />
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Share Direct Modal */}
      <AnimatePresence>
        {shareModalPostId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-surface/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="text-secondary" size={20} /> Compartilhar postagem
                </h3>
                <button 
                  onClick={() => setShareModalPostId(null)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {friends.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-8 font-bold">
                    Você ainda não tem amigos mútuos (`✨ Amigos`) para compartilhar diretamente. Conecte-se na Comunidade!
                  </p>
                ) : (
                  friends.map((friend: any) => (
                    <div 
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar user={friend} className="w-10 h-10 border border-white/10" />
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{friend.username}</p>
                          <p className="text-xs text-neutral-500">Nível {friend.level}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const sharedPost = feed?.find((p: any) => p.id === shareModalPostId);
                          if (sharedPost) {
                            shareMutation.mutate({ 
                              friendId: friend.id, 
                              postId: shareModalPostId, 
                              content: sharedPost.content 
                            });
                          }
                        }}
                        className="rounded-xl bg-primary hover:bg-primary-dark font-black text-[10px]"
                      >
                        ENVIAR
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );


}

