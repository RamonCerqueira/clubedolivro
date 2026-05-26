"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, Users, BookOpen, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { searchService } from "@/services";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "ALL" | "USERS" | "CLUBS" | "BOOKS" | "EVENTS";

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  // Keyboard shortcut Ctrl+K / Cmd+K handled externally but we can also double secure here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { data: results, isLoading } = useQuery<any>({
    queryKey: ["global-search", query],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length >= 2,
  });

  // Group results
  const users = results?.users || [];
  const clubs = results?.clubs || [];
  const books = results?.books || [];
  const events = results?.events || [];

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const filteredResults = () => {
    switch (activeTab) {
      case "USERS":
        return users.map((u: any) => ({ ...u, type: "USER" }));
      case "CLUBS":
        return clubs.map((c: any) => ({ ...c, type: "CLUB" }));
      case "BOOKS":
        return books.map((b: any) => ({ ...b, type: "BOOK" }));
      case "EVENTS":
        return events.map((e: any) => ({ ...e, type: "EVENT" }));
      case "ALL":
      default:
        return [
          ...users.map((u: any) => ({ ...u, type: "USER" })),
          ...clubs.map((c: any) => ({ ...c, type: "CLUB" })),
          ...books.map((b: any) => ({ ...b, type: "BOOK" })),
          ...events.map((e: any) => ({ ...e, type: "EVENT" })),
        ];
    }
  };

  const currentItems = filteredResults();

  const getIcon = (type: string) => {
    switch (type) {
      case "USER":
        return <User className="text-primary w-4 h-4" />;
      case "CLUB":
        return <Users className="text-secondary w-4 h-4" />;
      case "BOOK":
        return <BookOpen className="text-emerald-400 w-4 h-4" />;
      case "EVENT":
        return <Calendar className="text-amber-400 w-4 h-4" />;
      default:
        return <Search className="text-neutral-400 w-4 h-4" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "USER":
        return "Leitor";
      case "CLUB":
        return "Clube";
      case "BOOK":
        return "Livro";
      case "EVENT":
        return "Evento";
      default:
        return "";
    }
  };

  const getPath = (item: any) => {
    switch (item.type) {
      case "USER":
        return `/dashboard/profile/${item.id}`;
      case "CLUB":
        return `/clubes/${item.id}`;
      case "BOOK":
        return `/dashboard/books/${item.id}`;
      case "EVENT":
        return `/dashboard/events`;
      default:
        return "/dashboard";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[200]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-surface/90 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl z-[201] p-6 flex flex-col max-h-[60vh] overflow-hidden"
          >
            {/* Input Header */}
            <div className="relative flex items-center mb-6">
              <Search className="absolute left-5 text-neutral-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquise por leitores, clubes, livros e eventos..."
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/40 pl-14 pr-12 py-4 rounded-2xl border border-white/10 outline-none text-white focus:border-primary/50 text-sm font-semibold transition-all duration-300"
              />
              <button
                onClick={onClose}
                className="absolute right-5 p-1 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs bar */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/5 custom-scrollbar shrink-0">
              {([
                { id: "ALL", label: "Todos" },
                { id: "USERS", label: "Leitores" },
                { id: "CLUBS", label: "Clubes" },
                { id: "BOOKS", label: "Livros" },
                { id: "EVENTS", label: "Eventos" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-full border transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-white border-primary/30 shadow-lg shadow-primary/20 scale-105"
                      : "bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results body */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[150px]">
              {isLoading ? (
                <div className="h-40 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Vasculhando Leituri...</p>
                </div>
              ) : query.trim().length < 2 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                  <Search className="w-8 h-8 text-neutral-600 mb-2" />
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Busca Global</p>
                  <p className="text-[11px] text-neutral-600 mt-1">Digite pelo menos 2 caracteres para começar a buscar.</p>
                </div>
              ) : currentItems.length > 0 ? (
                <div className="space-y-2 pb-2">
                  {currentItems.map((item: any, idx: number) => (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => handleNavigate(getPath(item))}
                      className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/25 rounded-2xl cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-110 transition-all duration-300">
                          {getIcon(item.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">
                            {item.title || item.name || item.username}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                            {getLabel(item.type)} {item.author ? `• ${item.author}` : ""} {item.city ? `• ${item.city}` : ""}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                  <Search className="w-8 h-8 text-neutral-700 mb-2" />
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Nenhum resultado encontrado</p>
                  <p className="text-[11px] text-neutral-600 mt-1">Tente pesquisar usando outros termos ou palavras-chave.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
