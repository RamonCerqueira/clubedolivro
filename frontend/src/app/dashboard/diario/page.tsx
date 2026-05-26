"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Calendar, 
  Smile, 
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Send,
  Loader2
} from "lucide-react";
import { ReadingTree } from "@/components/features/ReadingTree";
import { journalService, authService, uploadService } from "@/services";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const FEELINGS_OPTIONS = [
  { emoji: "😊", label: "Inspirado" },
  { emoji: "😢", label: "Emocionado" },
  { emoji: "🤯", label: "Chocado" },
  { emoji: "😴", label: "Entediado" },
  { emoji: "🧠", label: "Reflexivo" },
  { emoji: "🔥", label: "Empolgado" },
  { emoji: "💖", label: "Romântico" },
  { emoji: "🧭", label: "Aventuroso" }
];

export default function DiarioPage() {
  const queryClient = useQueryClient();
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Media Attachment State
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"IMAGE" | "VIDEO" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [postToFeed, setPostToFeed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar perfil para estatísticas de XP/Level
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });

  // Buscar histórico de diários
  const { data: journals, isLoading: isJournalsLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: journalService.getAll,
  });

  // Mutação para criar entrada no diário
  const createMutation = useMutation({
    mutationFn: (payload: {
      bookTitle: string;
      author?: string;
      pagesRead: number;
      feelings: string[];
      notes?: string;
      mediaUrl?: string;
      mediaType?: string;
      postToFeed?: boolean;
    }) => journalService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["global-feed"] });
      
      // Limpar formulário
      setBookTitle("");
      setAuthor("");
      setPagesRead("");
      setSelectedFeelings([]);
      setNotes("");
      setAttachedFile(null);
      setAttachedPreview(null);
      setFileType(null);
      setPostToFeed(false);

      setSuccessMsg("Leitura registrada com sucesso! Você ganhou XP e sua semente cresceu!");
      setTimeout(() => setSuccessMsg(""), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || "Ocorreu um erro ao salvar sua leitura.");
      setTimeout(() => setErrorMsg(""), 5000);
    }
  });

  // Mutação para remover entrada no diário
  const deleteMutation = useMutation({
    mutationFn: (id: string) => journalService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  const toggleFeeling = (feeling: string) => {
    if (selectedFeelings.includes(feeling)) {
      setSelectedFeelings(prev => prev.filter(f => f !== feeling));
    } else {
      setSelectedFeelings(prev => [...prev, feeling]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 8.0) {
          alert("Erro: A duração do vídeo não pode exceder 8.0 segundos!");
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
      alert("Formato de arquivo não suportado!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;
    const pages = parseInt(pagesRead);
    if (isNaN(pages) || pages <= 0) {
      setErrorMsg("Por favor, insira um número válido de páginas lidas.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    let mediaUrl = undefined;
    let mediaType = undefined;

    if (attachedFile) {
      setIsUploading(true);
      try {
        const uploadResult = await uploadService.upload(attachedFile);
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.type;
      } catch (err) {
        setErrorMsg("Erro ao fazer upload da mídia anexada.");
        setTimeout(() => setErrorMsg(""), 4000);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    createMutation.mutate({
      bookTitle,
      author: author.trim() || undefined,
      pagesRead: pages,
      feelings: selectedFeelings,
      notes: notes.trim() || undefined,
      mediaUrl,
      mediaType,
      postToFeed
    });
  };

  // Calcular o total de páginas lidas de forma cumulativa
  const totalPagesRead = journals?.reduce((acc: number, entry: any) => acc + entry.pagesRead, 0) || 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative pb-20">
      
      {/* LEFT SIDE: Form and interactive stats */}
      <div className="xl:col-span-8 space-y-8">
        
        {/* Header estético */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase">
              Diário de Bordo
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-semibold mt-2">
              Registre suas leituras, acompanhe sua constelação de sabedoria e faça sua árvore de conhecimento florescer.
            </p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-3 backdrop-blur-xl shrink-0">
            <BookOpen className="text-primary animate-pulse" size={20} />
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Lido</p>
              <p className="text-lg font-black text-white">{totalPagesRead} págs</p>
            </div>
          </div>
        </div>

        {/* Notificações de Status */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 text-sm font-semibold"
            >
              <CheckCircle size={18} />
              {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-semibold"
            >
              <AlertCircle size={18} />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário de Registro de Leitura */}
        <Card className="p-6 md:p-8 border-white/5 bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-4">
              <Plus className="text-primary" size={20} /> Registrar Novo Trecho Lido
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título do Livro */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Título do Livro</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: O Hobbit"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full bg-black/40 p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary/40 transition-all text-white placeholder:text-zinc-600 font-medium"
                  />
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                </div>
              </div>

              {/* Autor */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Autor (Opcional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: J.R.R. Tolkien"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-black/40 p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-primary/40 transition-all text-white placeholder:text-zinc-600 font-medium"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Páginas Lidas */}
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Páginas Lidas</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Quantidade"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(e.target.value)}
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/5 outline-none focus:border-primary/40 transition-all text-white placeholder:text-zinc-600 font-black text-center text-lg"
                />
              </div>

              {/* Emoções / Emojis do Dia */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                  <Smile size={14} /> Como você se sentiu lendo esse trecho?
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEELINGS_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => toggleFeeling(opt.emoji)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        selectedFeelings.includes(opt.emoji)
                          ? "bg-primary/20 border-primary text-white scale-105"
                          : "bg-white/2 border-white/5 text-zinc-400 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">{opt.emoji}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notas / Anotações */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                <FileText size={14} /> Insights & Citações Marcantes
              </label>
              <textarea
                placeholder="Escreva seus pensamentos sobre esse trecho..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-black/40 p-4 rounded-2xl border border-white/5 outline-none focus:border-primary/40 transition-all text-white placeholder:text-zinc-600 font-medium min-h-[100px] resize-none"
              />
            </div>

            {/* Mídia Anexa e Opção de Publicar no Feed */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
              <div className="space-y-2 flex-grow">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  Anexar Foto ou Vídeo (vídeo máx 8s)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <ImageIcon size={16} />
                    <span>Mídia</span>
                  </button>
                  {attachedFile && (
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1.5 rounded-xl font-bold uppercase tracking-wider animate-pulse">
                      Pronto ({fileType})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="checkbox"
                  id="postToFeedCheckbox"
                  checked={postToFeed}
                  onChange={(e) => setPostToFeed(e.target.checked)}
                  className="w-5 h-5 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/20 focus:ring-offset-0 focus:outline-none transition-all cursor-pointer"
                />
                <label 
                  htmlFor="postToFeedCheckbox"
                  className="text-xs font-bold text-white uppercase tracking-wider cursor-pointer select-none"
                >
                  Publicar no Feed Global? 📢
                </label>
              </div>
            </div>

            {/* Preview da Mídia Anexada */}
            {attachedPreview && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-60 flex items-center justify-center bg-black/30">
                {fileType === "IMAGE" ? (
                  <img src={attachedPreview} alt="Attached Preview" className="object-cover max-h-60 w-full" />
                ) : (
                  <video src={attachedPreview} controls muted className="max-h-60 w-full object-cover" />
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);
                    setAttachedPreview(null);
                    setFileType(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/95 rounded-full text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || isUploading}
                className="px-10 h-14 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-full shadow-[0_10px_35px_rgba(80,70,229,0.3)] hover:shadow-primary/50 transition-all text-xs tracking-widest uppercase hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                {createMutation.isPending || isUploading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>PUBLICANDO...</span>
                  </>
                ) : "REGISTRAR LEITURA"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Histórico do Diário */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Calendar className="text-secondary" size={18} /> Linha do Tempo Literária
          </h3>

          <div className="space-y-4">
            {isJournalsLoading ? (
              <div className="text-center py-10 text-zinc-600 font-bold">Carregando diário de bordo...</div>
            ) : journals && journals.length > 0 ? (
              <AnimatePresence>
                {journals.map((entry: any, index: number) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 md:p-6 border border-white/5 bg-white/2 backdrop-blur-xl rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/20 transition-all"
                  >
                    <div className="flex gap-4 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="font-extrabold text-white text-base tracking-tight leading-snug">
                            {entry.bookTitle}
                          </h4>
                          {entry.author && (
                            <span className="text-xs text-zinc-500 font-semibold">por {entry.author}</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                          <span>📖 <strong className="text-white">{entry.pagesRead} páginas</strong> lidas</span>
                          <span>•</span>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                            {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </p>
                        
                        {entry.feelings && entry.feelings.length > 0 && (
                          <div className="flex gap-1.5 pt-1.5">
                            {entry.feelings.map((emoji: string, i: number) => (
                              <span key={i} className="text-sm bg-white/5 border border-white/5 w-7 h-7 rounded-lg flex items-center justify-center">
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}

                        {entry.notes && (
                          <p className="text-zinc-500 text-xs mt-3 p-3 bg-black/30 border border-white/5 rounded-xl font-medium leading-relaxed italic max-w-xl">
                            "{entry.notes}"
                          </p>
                        )}

                        {entry.mediaUrl && (
                          <div className="mt-3 rounded-2xl overflow-hidden border border-white/5 max-w-md max-h-48 bg-black/20 flex items-center justify-center">
                            {entry.mediaType === "VIDEO" ? (
                              <video src={`http://localhost:3000${entry.mediaUrl}`} controls muted className="max-h-48 w-full object-cover" />
                            ) : (
                              <img src={`http://localhost:3000${entry.mediaUrl}`} alt="Journal Media" className="object-cover max-h-48 w-full" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteMutation.mutate(entry.id)}
                      className="opacity-0 group-hover:opacity-100 p-3 rounded-xl bg-white/2 border border-white/5 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0 self-end md:self-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-12 text-zinc-600 border-2 border-dashed border-white/5 rounded-3xl font-semibold">
                Nenhum registro no seu diário de bordo ainda. Faça sua primeira leitura!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Interactive Tree rendering */}
      <div className="xl:col-span-4 sticky top-24 space-y-6">
        
        {/* Árvore de Leitura */}
        <ReadingTree totalPages={totalPagesRead} />

        {/* Nível e Gamificação de Apoio */}
        {profile && (
          <div className="glass-card p-6 border border-white/5 bg-white/2 backdrop-blur-xl rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-[40px] pointer-events-none" />
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Progresso de Sabedoria</h4>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-black/40 text-black">
                <span className="text-[8px] font-black leading-none uppercase tracking-wider">Nível</span>
                <span className="text-2xl font-black leading-none">{profile.level}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-1">
                  <span className="text-zinc-400">Pontos</span>
                  <span className="text-primary">{profile.points} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(80,70,229,0.3)] transition-all duration-1000"
                    style={{ width: `${profile.points % 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <span>Racha Literário: {profile.streak} dias 🔥</span>
              <span>Ativo hoje</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
