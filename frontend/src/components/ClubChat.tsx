"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Send, 
  Users, 
  MessageSquare, 
  Paperclip,
  Smile,
  Loader2
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { chatService, authService } from "@/services";

interface ClubChatProps {
  club: {
    id: string;
    name: string;
    members: number;
  };
  onClose: () => void;
}

export function ClubChat({ club, onClose }: ClubChatProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getProfile(),
  });

  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["chat", club.id],
    queryFn: () => chatService.getHistory({ clubId: club.id }),
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatService.sendMessage({ content, clubId: club.id }),
    onSuccess: () => {
      setInputText("");
      queryClient.invalidateQueries({ queryKey: ["chat", club.id] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputText);
  };

  return (
    <Card className="flex flex-col h-full bg-[#0a0a0c] border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 rounded-[2rem]">
      {/* Chat Header */}
      <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/2 backdrop-blur-3xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {club.name}
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              {club.members || 0} LEITORES EM SINCRONIA
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <Button variant="ghost" className="w-12 h-12 rounded-xl bg-white/5 text-neutral-400">
            <Paperclip size={20} />
          </Button>
          <Button variant="ghost" className="w-12 h-12 rounded-xl bg-white/5 text-neutral-400">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-black/40 to-transparent"
      >
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest">Carregando Diálogos...</p>
          </div>
        ) : messages?.length > 0 ? messages.map((msg: any) => {
          const isMe = msg.userId === me?.id;
          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-5 max-w-[80%] animate-in fade-in slide-in-from-bottom-4",
                isMe ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {!isMe && <Avatar user={msg.user} size="sm" className="mt-1 ring-2 ring-primary/20" />}
              <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                {!isMe && (
                  <span className="text-[10px] font-black text-neutral-500 ml-2 mb-2 uppercase tracking-widest">
                    {msg.user?.username || "Leitor"}
                  </span>
                )}
                <div 
                  className={cn(
                    "px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-2xl",
                    isMe 
                      ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                      : "bg-white/5 border border-white/10 text-neutral-200 rounded-tl-none shadow-black/40"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-neutral-600 font-black mt-2 uppercase tracking-widest px-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center h-full opacity-10">
            <MessageSquare size={80} strokeWidth={1} />
            <p className="mt-6 font-black uppercase tracking-[0.4em] text-xs">O silêncio precede a grande ideia.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSendMessage}
        className="p-8 bg-white/2 backdrop-blur-3xl border-t border-white/5 flex gap-4 items-end"
      >
        <div className="flex-1 relative">
          <textarea 
            rows={1}
            placeholder="Compartilhe um insight brilhante..." 
            className="w-full bg-black/40 border border-white/10 rounded-3xl px-6 py-5 pr-14 outline-none focus:border-primary/50 transition-all resize-none max-h-32 min-h-[64px] font-medium text-white placeholder:text-neutral-600"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button type="button" className="absolute right-5 bottom-5 text-neutral-600 hover:text-primary transition-colors">
            <Smile size={24} />
          </button>
        </div>
        <button 
          type="submit" 
          disabled={!inputText.trim() || sendMutation.isPending}
          className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary text-white rounded-[1.5rem] flex items-center justify-center hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group"
        >
          {sendMutation.isPending ? <Loader2 className="animate-spin" /> : <Send size={28} className="ml-1 group-hover:translate-x-0.5 transition-transform" />}
        </button>
      </form>
    </Card>
  );
}

const MoreHorizontal = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);
