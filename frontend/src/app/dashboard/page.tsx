"use client";
import React, { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  BookOpen, 
  Send, 
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Calendar,
  Zap,
  Star,
  Image as ImageIcon,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { bookService, authService, clubService, chatService, userService, uploadService } from "@/services";
import { FeedCard } from "@/components/features/FeedCard";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PDFFlipReader = dynamic(
  () => import("@/components/features/PDFFlipReader").then((mod) => mod.PDFFlipReader),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video')) {
        setPostImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setRawImageUrl(URL.createObjectURL(file));
        setCrop(undefined);
        setIsCropModalOpen(true);
      }
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setPreviewUrl(null);
    setRawImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const finalizeCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && rawImageUrl) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) return;
          const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          setPostImage(croppedFile);
          setPreviewUrl(URL.createObjectURL(blob));
          setIsCropModalOpen(false);
        }, "image/jpeg", 0.95);
      }
    } else if (rawImageUrl) {
      const res = await fetch(rawImageUrl);
      const blob = await res.blob();
      setPostImage(new File([blob], "original.jpg", { type: "image/jpeg" }));
      setPreviewUrl(rawImageUrl);
      setIsCropModalOpen(false);
    }
  };
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ url: string; title: string } | null>(null);

  const openReader = (url: string, title: string) => {
    setSelectedBook({ url, title });
    setIsReaderOpen(true);
  };

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: bookService.getRecommendations,
  });

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["feed-global"],
    queryFn: () => clubService.getGlobalFeed(),
  });

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

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (payload: { content: string, file?: File | null }) => {
      let mediaUrl = undefined;
      let mediaType = undefined;
      if (payload.file) {
        const uploadRes = await uploadService.upload(payload.file);
        mediaUrl = uploadRes.url;
        mediaType = payload.file.type.startsWith("video") ? "VIDEO" : "IMAGE";
      }
      return clubService.createPost(payload.content, undefined, undefined, mediaUrl, mediaType);
    },
    onSuccess: () => {
      setNewPost("");
      removeImage();
      queryClient.invalidateQueries({ queryKey: ["feed-global"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (payload: { postId: string; content: string; parentId?: string }) => 
      clubService.commentPost(payload.postId, payload.content, payload.parentId),
    onSuccess: (_, variables) => {
      setNewComments((prev) => ({ ...prev, [variables.postId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["feed-global"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => clubService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-global"] });
    },
  });

  const clapMutation = useMutation({
    mutationFn: (payload: { postId: string; claps: number }) => 
      clubService.reactPost(payload.postId, payload.claps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-global"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: (payload: { friendId: string; postId: string; content: string }) => 
      chatService.sendMessage({
        content: `🔗 [POST COMPARTILHADO] Espreite esta discussão literária:\n"${payload.content.substring(0, 80)}..."\nVisualizar em: /dashboard#post-${payload.postId}`,
        receiverId: payload.friendId
      }),
    onSuccess: () => {
      alert("Post compartilhado com sucesso no chat privado!");
      setShareModalPostId(null);
    }
  });

  const handleClap = (postId: string, currentReactions: any[]) => {
    const myClap = currentReactions?.find((r: any) => r.userId === user?.id);
    const myClapCount = myClap ? myClap.claps : 0;
    const newClapCount = myClapCount > 0 ? 0 : 1;

    clapMutation.mutate({ postId, claps: newClapCount });
  };

  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({});
  const [shareModalPostId, setShareModalPostId] = useState<string | null>(null);

  const user = profile || { username: "Carregando...", level: 1, points: 0, streak: 0 };
  const books = recommendations || [];
  const posts = feedData || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT SIDEBAR: User Stats */}
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-6 sticky top-24 hidden lg:block"
      >
        <div className="glass-card p-6 overflow-hidden relative border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-black/50">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-[60px]" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110" />
              <Avatar user={{ name: user.username, avatar: user.avatar }} className="ring-4 ring-primary/20 w-24 h-24 relative z-10" />
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-2 -right-2 z-20"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-black text-xs font-black">LVL</div>
              </motion.div>
            </div>
            <h3 className="font-black text-2xl tracking-tighter">{user.username}</h3>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2 opacity-80 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">LEITOR EXPLORADOR</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-10">
            <div className="bg-white dark:bg-white/2 rounded-3xl p-5 text-center border border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors group">
              <TrendingUp className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" size={20} />
              <p className="text-2xl font-black">{user.points}</p>
              <p className="text-[9px] uppercase font-black text-slate-500 dark:text-neutral-500 tracking-widest">PONTOS</p>
            </div>
            <div className="bg-white dark:bg-white/2 rounded-3xl p-5 text-center border border-slate-200 dark:border-white/5 hover:bg-white/5 transition-colors group">
              <Zap className="mx-auto mb-2 text-yellow-500 group-hover:scale-110 transition-transform" size={20} />
              <p className="text-2xl font-black">{user.streak}</p>
              <p className="text-[9px] uppercase font-black text-slate-500 dark:text-neutral-500 tracking-widest">RACHA</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4">Sua Jornada</h4>
            
            {/* Author Specialist Insight */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 group cursor-help transition-all hover:bg-primary/20">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-1.5 bg-primary text-slate-900 dark:text-white rounded-lg">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase">80%</span>
               </div>
               <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Especialista em Machado</p>
               <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary w-[80%] shadow-[0_0_10px_rgba(80,70,229,0.5)]" />
               </div>
               <p className="text-[9px] text-slate-500 dark:text-neutral-500 mt-2 font-bold line-clamp-1 italic italic">Faltam 2 obras para o selo Real</p>
            </div>

            {/* Reading Habit Insight */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 group cursor-help transition-all hover:bg-secondary/20">
               <div className="flex justify-between items-center mb-2">
                  <div className="p-1.5 bg-secondary text-slate-900 dark:text-white rounded-lg">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <span className="text-[9px] font-black text-secondary uppercase">Novo</span>
               </div>
               <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Coruja de Biblioteca</p>
               <p className="text-[10px] text-slate-500 dark:text-neutral-500 mt-1 font-bold">90% das suas leituras acontecem após às 22h.</p>
            </div>

            <div className="flex justify-between text-[10px] font-black mb-1 uppercase tracking-widest mt-6">
              <span className="text-slate-500 dark:text-neutral-500">EXPERIÊNCIA</span>
              <span className="text-primary">{(user.points % 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${user.points % 100}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] rounded-full shadow-[0_0_15px_rgba(80,70,229,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* CENTER: Main Feed */}
      <main className="lg:col-span-6 space-y-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 backdrop-blur-2xl rounded-[2rem] group focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-500 shadow-2xl shadow-black/20">
            <div className="flex gap-4">
              <Avatar user={{ name: user.username, avatar: user.avatar }} className="w-12 h-12 ring-2 ring-white/5 shadow-lg shadow-black" />
              <div className="flex-1">
                <textarea 
                  placeholder="Compartilhe seus progressos ou ideias..."
                  className="w-full bg-slate-100 dark:bg-black/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 outline-none focus:border-primary/30 transition-all placeholder:text-neutral-600 resize-none min-h-[120px] text-lg font-medium text-slate-900 dark:text-white scrollbar-hide"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                
                {previewUrl && (
                  <div className="relative mt-4 w-fit">
                    <img src={previewUrl} alt="Preview" className="h-32 rounded-xl object-cover border border-slate-200 dark:border-white/10" />
                    <button 
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-2 text-slate-500 dark:text-neutral-500">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageSelect} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:text-primary transition-all hover:bg-primary/10 group/icon"
                    >
                        <ImageIcon size={20} className="group-hover/icon:scale-110 transition-transform" />
                    </button>
                  </div>
                  <Button 
                    onClick={() => createPostMutation.mutate({ content: newPost, file: postImage })}
                    disabled={(!newPost.trim() && !postImage) || createPostMutation.isPending} 
                    className="px-10 h-12 rounded-full bg-primary text-slate-900 dark:text-white font-black shadow-[0_8px_30px_rgb(80,70,229,0.4)] hover:shadow-primary/60 transition-all uppercase tracking-widest text-[10px]"
                  >
                    {createPostMutation.isPending ? "ENVIANDO..." : <>POSTAR <Send size={16} className="ml-1" /></>}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Reading Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 md:p-10 bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent border border-slate-200 dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/10"
        >
          <div className="absolute -right-32 -top-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px] group-hover:bg-primary/40 transition-all duration-1000 group-hover:translate-x-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="w-40 md:w-56 h-auto aspect-[3/4] flex-shrink-0 relative group-hover:rotate-6 group-hover:-translate-y-2 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden rounded-[1.5rem] border border-slate-300 dark:border-white/10">
              <img 
                src="/premium_book_cover_sci_fi.png" 
                alt="Destaque" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3 h-3 fill-primary" /> LEITURA DO CLUBE
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">Duna: O Épico das Areias</h2>
              <p className="text-slate-600 dark:text-neutral-400 text-sm md:text-lg leading-relaxed max-w-sm font-medium">
                Acesse o manuscrito digital com nossa tecnologia de virada de páginas em 3D.
              </p>
              <div className="pt-2">
                <Button 
                  onClick={() => openReader("/books/duna.pdf", "Duna - Edição do Clube")}
                  className="rounded-full px-10 bg-white text-black font-black hover:bg-neutral-200 shadow-2xl shadow-white/10 h-14 group/btn transition-all active:scale-95"
                >
                  ABRIR LIVRO 3D <BookOpen className="ml-3 w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {posts.length > 0 ? posts.map((post: any, idx: number) => {
            const totalClaps = post.reactions?.reduce((acc: number, curr: any) => acc + curr.claps, 0) || 0;
            const myClap = post.reactions?.find((r: any) => r.userId === user?.id);
            const myClapCount = myClap ? myClap.claps : 0;

            return (
              <FeedCard 
                key={post.id} 
                post={post} 
                index={idx}
                me={user}
                totalClaps={totalClaps}
                myClapCount={myClapCount}
                handleClap={handleClap}
                expandedComments={!!expandedComments[post.id]}
                toggleComments={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                newCommentText={newComments[post.id] || ""}
                setNewCommentText={(txt) => setNewComments(prev => ({ ...prev, [post.id]: txt }))}
                submitComment={(parentId) => commentMutation.mutate({ postId: post.id, content: newComments[post.id] || "", parentId })}
                deleteComment={(cid) => deleteCommentMutation.mutate(cid)}
                openShareModal={() => setShareModalPostId(post.id)}
              />
            );
          }) : (
            <div className="text-center py-20 text-slate-500 dark:text-neutral-500 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
              Nenhuma discussão encontrada no seu feed.
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* RIGHT SIDEBAR: Suggested Books & Events */}
      <motion.aside 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-8 sticky top-24"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-secondary" /> Sugestões para Você
          </h3>
          <div className="space-y-4">
            {books.map((book: any) => (
              <div 
                key={book.id} 
                onClick={() => openReader(book.pdfUrl || "/books/duna.pdf", book.title)}
                className="glass-card p-4 flex gap-4 cursor-pointer group hover:bg-white/5 active:scale-95 transition-all border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 backdrop-blur-xl rounded-[1.5rem] shadow-xl shadow-black/20"
              >
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0 shadow-2xl border border-slate-300 dark:border-white/10">
                  <img src={book.cover || "/premium_book_cover_sci_fi.png"} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-center">
                  <h5 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-snug">{book.title}</h5>
                  <p className="text-[10px] text-slate-500 dark:text-neutral-500 mt-1 uppercase font-black tracking-widest">{book.author}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex text-yellow-500">
                       <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-black text-white/40">5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => router.push('/dashboard/books')} variant="ghost" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all border border-dashed border-primary/20">VER BIBLIOTECA COMPLETA</Button>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 overflow-hidden relative group cursor-pointer rounded-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
            <Calendar size={80} />
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Próximo Evento</p>
          <h4 className="font-bold text-lg mb-1">Debate: Machado de Assis</h4>
          <p className="text-xs text-slate-600 dark:text-neutral-400 mb-4 flex items-center gap-2">
            <Calendar size={14} /> Amanhã, 19:30 • Online
          </p>
          <Button 
            className="w-full rounded-xl bg-white text-black font-black hover:bg-neutral-200"
            onClick={() => router.push('/dashboard/events')}
          >
            Ver Detalhes
          </Button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isReaderOpen && selectedBook && (
          <PDFFlipReader 
            fileUrl={selectedBook.url} 
            title={selectedBook.title}
            onClose={() => setIsReaderOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* CROP MODAL */}
      <AnimatePresence>
        {isCropModalOpen && rawImageUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              <h2 className="text-xl font-black text-white mb-4">Ajustar Imagem</h2>
              <div className="overflow-auto flex-1 flex justify-center items-center bg-black/50 rounded-xl border border-white/5 min-h-[300px]">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img ref={imgRef} src={rawImageUrl} alt="Crop preview" className="max-h-[50vh] object-contain" />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <Button onClick={() => { setIsCropModalOpen(false); removeImage(); }} variant="ghost" className="text-white hover:bg-white/10">Cancelar</Button>
                <Button onClick={finalizeCrop} className="bg-primary hover:bg-primary/80 font-black px-8">Confirmar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
