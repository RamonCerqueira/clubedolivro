"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { chatService, userService, authService } from "@/services";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-black"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" /></div>}>
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
  const socketRef = useRef<Socket | null>(null);

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

  // Configura a conexão WebSocket
  useEffect(() => {
    if (!me?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const socket = io(socketUrl, {
      transports: ["websocket"],
      query: { userId: me.id },
    });

    socketRef.current = socket;

    // Entra na sala pessoal do usuário logado
    socket.emit("joinRoom", { roomId: me.id });

    // Entra na sala compartilhada para DMs
    if (receiverId) {
      const chatRoomId = [me.id, receiverId].sort().join("-");
      socket.emit("joinRoom", { roomId: chatRoomId });
    }

    // Escuta novas mensagens em tempo real
    socket.on("msgToClient", (newMsg: any) => {
      queryClient.setQueryData(["chat", receiverId], (oldData: any) => {
        if (!oldData) return [newMsg];
        if (oldData.some((m: any) => m.id === newMsg.id)) return oldData;
        return [...oldData, newMsg];
      });
    });

    return () => {
      if (receiverId) {
        const chatRoomId = [me.id, receiverId].sort().join("-");
        socket.emit("leaveRoom", { roomId: chatRoomId });
      }
      socket.emit("leaveRoom", { roomId: me.id });
      socket.disconnect();
    };
  }, [me?.id, receiverId, queryClient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !receiverId || !me?.id || !socketRef.current) return;

    const chatRoomId = [me.id, receiverId].sort().join("-");

    // Envia a mensagem via WebSocket
    socketRef.current.emit("msgToServer", {
      roomId: chatRoomId,
      userId: me.id,
      content: message,
      type: "direct",
      receiverId: receiverId,
    });

    setMessage("");
  };

  const activeContact = following?.find((u: any) => u.id === receiverId);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-black overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className={cn(
        "w-full md:w-80 border-r border-white/5 flex flex-col bg-neutral-900/20 backdrop-blur-xl transition-all",
        receiverId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-black text-white tracking-tighter mb-4">MENSAGENS</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar conversas..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {following?.map((user: any) => (
            <button
              key={user.id}
              onClick={() => router.push(`/chat?receiverId=${user.id}`)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all group mb-1",
                receiverId === user.id ? "bg-primary/20 border border-primary/20" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="relative">
                <Avatar user={user} className="w-12 h-12" />
                <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-current border-2 border-black rounded-full" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={cn(
                    "font-bold truncate text-sm uppercase tracking-tight",
                    receiverId === user.id ? "text-primary" : "text-white"
                  )}>
                    {user.username}
                  </h4>
                  <span className="text-[10px] text-neutral-600 font-medium">12:45</span>
                </div>
                <p className="text-neutral-500 text-xs truncate font-medium">Click para iniciar conversa...</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col relative",
        !receiverId ? "hidden md:flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" : "flex"
      )}>
        {!receiverId ? (
          <div className="text-center space-y-4 max-w-sm px-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-2xl shadow-primary/20">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">SUA CAIXA DE ENTRADA</h3>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed">
              Mande mensagens diretas para seus amigos do clube, combine leituras e compartilhe descobertas.
            </p>
            <Button 
              className="rounded-xl px-8 bg-primary text-white font-black hover:bg-primary-dark shadow-xl shadow-primary/20 mt-4"
              onClick={() => router.push('/dashboard/connections')}
            >
              BUSCAR AMIGOS
            </Button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-white/5 px-6 flex items-center justify-between glass z-10">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary">
                <button onClick={() => router.push('/chat')} className="md:hidden p-2 -ml-2 text-neutral-400">
                  <ChevronLeft size={24} />
                </button>
                <Avatar user={activeContact} className="w-10 h-10 border border-primary/20" />
                <div>
                  <h3 className="text-white text-base font-black tracking-tight leading-none mb-1">{activeContact?.username}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-70">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    ONLINE AGORA
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl"><Phone size={20}/></Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl"><Video size={20}/></Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl"><MoreVertical size={20}/></Button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black"
            >
              {isLoadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
                </div>
              ) : chatHistory?.map((msg: any) => {
                const isMe = msg.userId === me?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      isMe ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium shadow-lg",
                      isMe 
                        ? "bg-primary text-white rounded-tr-none shadow-primary/10" 
                        : "bg-white/5 text-neutral-200 border border-white/10 rounded-tl-none shadow-black/20"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-neutral-600 font-bold mt-1 uppercase tracking-tighter">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              className="p-6 bg-black border-t border-white/5"
            >
              <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-4 rounded-[2rem] focus-within:border-primary/50 transition-all shadow-2xl">
                <button type="button" className="text-neutral-500 hover:text-primary transition-colors"><Smile size={22}/></button>
                <button type="button" className="text-neutral-500 hover:text-primary transition-colors"><Paperclip size={22}/></button>
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem brilhante..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-neutral-600 font-medium py-2"
                />
                <Button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-12 h-12 rounded-full bg-primary text-white p-0 flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-primary/30"
                >
                  <Send size={20} className="-mr-0.5 mt-0.5" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
