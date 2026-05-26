"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Paperclip,
  ChevronLeft,
  Circle,
  MessageCircle,
  Hash,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { chatService, userService, authService } from "@/services";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

export default function DashboardChatPage() {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-black/20 rounded-[3rem] border border-white/5 backdrop-blur-3xl"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" /></div>}>
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receiverId = searchParams.get("receiverId");
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getProfile(),
  });

  const { data: following } = useQuery({
    queryKey: ["following"],
    queryFn: () => userService.getFollowing(),
  });

  const { data: chatHistory, isLoading: isLoadingChat } = useQuery({
    queryKey: ["chat", receiverId],
    queryFn: () => chatService.getHistory({ receiverId: receiverId! }),
    enabled: !!receiverId,
  });

  // Sync historical messages
  useEffect(() => {
    if (chatHistory) {
      setLiveMessages(chatHistory);
    }
  }, [chatHistory]);

  // Connect to WebSocket room
  useEffect(() => {
    if (!receiverId || !me) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";
    const s = io(wsUrl);

    // direct chat room is sorted user ids
    const roomId = [me.id, receiverId].sort().join("-");
    s.emit("joinRoom", { roomId });

    s.on("msgToClient", (msg: any) => {
      setLiveMessages((prev) => {
        // avoid duplicate display of self messages
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    setSocket(s);

    return () => {
      s.emit("leaveRoom", { roomId });
      s.disconnect();
    };
  }, [receiverId, me]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveMessages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !receiverId || !me) return;

    const roomId = [me.id, receiverId].sort().join("-");

    socket?.emit("msgToServer", {
      roomId,
      userId: me.id,
      content: message,
      type: "direct",
      receiverId
    });

    // Also immediately add a pending representation to self UI for ultra fast feel
    const pendingMsg = {
      id: `pending-${Date.now()}`,
      content: message,
      userId: me.id,
      createdAt: new Date().toISOString(),
    };
    setLiveMessages((prev) => [...prev, pendingMsg]);

    setMessage("");
  };

  const activeContact = following?.find((u: any) => u.id === receiverId);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl">
      {/* Sidebar - Contacts */}
      <div className={cn(
        "w-full md:w-96 border-r border-white/5 flex flex-col bg-white/2 transition-all",
        receiverId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Mensagens</h2>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
               <Hash size={20} />
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar conversas..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2 space-y-2">
          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-4 mb-4">Leitores Frequentemente Contatados</p>
          {following?.map((user: any) => (
            <button
              key={user.id}
              onClick={() => router.push(`/dashboard/chat?receiverId=${user.id}`)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group relative",
                receiverId === user.id ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar user={user} className={cn("w-14 h-14 border-2 transition-all", receiverId === user.id ? "border-white/20" : "border-primary/20")} />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-black rounded-full" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={cn(
                    "font-black truncate text-base uppercase tracking-tight",
                    receiverId === user.id ? "text-white" : "text-neutral-200"
                  )}>
                    {user.username}
                  </h4>
                  <span className={cn("text-[10px] whitespace-nowrap", receiverId === user.id ? "text-white/60" : "text-neutral-600")}>
                    HÁ 2M
                  </span>
                </div>
                <p className={cn("text-sm truncate font-medium", receiverId === user.id ? "text-white/80" : "text-neutral-500")}>
                  Clique para sincronizar ideias...
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col relative bg-gradient-to-br from-black/40 via-transparent to-transparent",
        !receiverId ? "hidden md:flex items-center justify-center" : "flex"
      )}>
        {!receiverId ? (
          <div className="text-center space-y-8 max-w-sm px-10">
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-primary shadow-2xl shadow-primary/10 border border-primary/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <MessageCircle size={60} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Sua rede de inteligência</h3>
              <p className="text-neutral-500 text-base font-medium leading-relaxed italic">
                Crie conexões neurais. O conhecimento é multiplicado quando compartilhado em tempo real.
              </p>
            </div>
            <Button 
              className="rounded-full px-12 h-16 bg-white text-black font-black hover:bg-neutral-200 shadow-2xl shadow-white/10 mt-8 group transition-all"
              onClick={() => router.push('/dashboard/connections')}
            >
              CONECTAR COM LEITORES <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-28 border-b border-white/5 px-10 flex items-center justify-between glass z-10">
              <div className="flex items-center gap-5">
                <button onClick={() => router.push('/dashboard/chat')} className="md:hidden p-2 -ml-2 text-neutral-400">
                  <ChevronLeft size={24} />
                </button>
                <div className="relative">
                  <Avatar user={activeContact} className="w-14 h-14 border-2 border-primary/30" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-black tracking-tight leading-none mb-1.5 uppercase">{activeContact?.username}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-widest opacity-80 decoration-primary underline-offset-4 decoration-2">
                    SINCRONIZADO AGORA
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all text-xl"><Phone size={24}/></Button>
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all text-xl"><Video size={24}/></Button>
                <div className="w-px h-8 bg-white/5 mx-2" />
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all text-xl"><MoreVertical size={24}/></Button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar"
            >
              {isLoadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
                </div>
              ) : liveMessages?.map((msg: any) => {
                const isMe = msg.userId === me?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      isMe ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-6 py-4 rounded-[2rem] text-base font-medium shadow-2xl",
                      isMe 
                        ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                        : "bg-white/5 text-neutral-200 border border-white/10 rounded-tl-none shadow-black/40"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-neutral-600 font-black mt-2 uppercase tracking-widest px-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              className="p-10 pt-4"
            >
              <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 p-4 pl-6 rounded-[2.5rem] focus-within:border-primary/50 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] active:scale-[0.99] duration-200">
                <button type="button" className="text-neutral-500 hover:text-primary transition-colors"><Smile size={26}/></button>
                <button type="button" className="text-neutral-500 hover:text-primary transition-colors"><Paperclip size={26}/></button>
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inicie uma discussão brilhante..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-neutral-600 font-medium py-2 text-lg"
                />
                <Button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-14 h-14 rounded-full bg-primary text-white p-0 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-primary/40 group"
                >
                  <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
