"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Users, 
  Calendar, 
  Trophy, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Bell,
  Search,
  MessageSquare,
  FileText
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { SearchModal } from "@/components/features/SearchModal";
import { useEffect } from "react";

const NAV_ITEMS = [
  { id: "feed", href: "/dashboard/feed", icon: <Compass size={24} />, label: "Feed Social" },
  { id: "dashboard", href: "/dashboard", icon: <BookOpen size={24} />, label: "Início" },
  { id: "diario", href: "/dashboard/diario", icon: <FileText size={24} />, label: "Diário" },
  { id: "clubs", href: "/dashboard/clubs", icon: <Users size={24} />, label: "Clubes" },
  { id: "events", href: "/dashboard/events", icon: <Calendar size={24} />, label: "Eventos" },
  { id: "community", href: "/dashboard/connections", icon: <Users size={24} />, label: "Comunidade" },
  { id: "chat", href: "/dashboard/chat", icon: <MessageSquare size={24} />, label: "Mensagens" },
  { id: "profile", href: "/dashboard/profile", icon: <Trophy size={24} />, label: "Perfil" },
];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeUser = user || {
    username: "Visitante",
    level: 1,
    avatar: undefined
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-surface/50 border-r border-white/5 p-6 sticky top-0 h-screen z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <Image src="/logo.png" alt="Leituri" width={40} height={40} className="rounded-xl object-contain" />
          <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Leituri
          </span>
        </div>
        
        <nav className="flex-grow space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all relative group",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                )}
              >
                {item.icon} 
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-50 -z-0" />
                )}
              </a>
            );
          })}
          
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all text-neutral-500 hover:text-white hover:bg-white/5 relative mt-1"
          >
            <Search size={24} />
            <span>Busca Global</span>
            <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-md font-semibold text-neutral-400">Ctrl+K</span>
          </button>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all text-neutral-500 hover:text-white hover:bg-white/5 relative mt-1"
          >
            <div className="relative">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-background shadow-lg shadow-rose-500/20">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Notificações</span>
          </button>
        </nav>

        <div className="pt-8 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
            <Avatar user={activeUser} />
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{activeUser.username}</p>
              <p className="text-xs text-secondary font-bold">Nível {activeUser.level}</p>
            </div>
          </div>
          <Button variant="ghost" fullWidth className="justify-start px-4 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
            <LogOut size={20} /> Sair da conta
          </Button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden bg-surface/80 border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 font-black text-xl">
          <Image src="/logo.png" alt="Leituri" width={32} height={32} className="rounded-xl object-contain" />
          <span className="text-foreground">Leituri</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 text-neutral-400 hover:text-white transition-colors">
            <Search size={24} />
          </button>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 text-neutral-400 relative"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>
          <button 
            className="p-2 text-neutral-400" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[69px] bg-background/95 z-40 backdrop-blur-xl p-6"
          >
            <nav className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-lg",
                    pathname === item.href ? "bg-primary/10 text-primary border border-primary/20" : "text-neutral-400"
                  )}
                >
                  {item.icon} {item.label}
                </a>
              ))}
              <div className="h-px bg-white/5 my-6" />
              <button className="w-full flex items-center gap-4 px-6 py-5 text-rose-500 font-extrabold text-lg">
                <LogOut size={24} /> Sair da conta
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="flex-1 p-4 md:p-10 max-w-6xl w-full mx-auto pb-32 md:pb-10 min-h-screen">
        {children}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-3xl border border-white/10 flex justify-around items-center z-50 px-4 shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all relative",
                isActive ? "text-primary scale-110" : "text-neutral-500"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNav"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Drawer de Notificações Glassmorphism */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-surface/90 border-l border-white/10 backdrop-blur-2xl z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <Bell className="text-secondary" size={24} />
                  <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                    Notificações
                  </h2>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Bell size={48} className="text-neutral-600 mb-4 animate-pulse" />
                    <p className="text-neutral-400 font-bold">Nenhuma notificação por enquanto</p>
                    <p className="text-neutral-500 text-xs mt-1">Interaja com a comunidade para ver novidades por aqui!</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                        notif.read
                          ? "bg-white/2 border-white/5 text-neutral-400"
                          : "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-white shadow-lg shadow-primary/5"
                      )}
                    >
                      {!notif.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                      )}
                      <p className="font-semibold text-sm leading-relaxed pr-6">{notif.content}</p>
                      <span className="text-[10px] text-neutral-500 font-bold block mt-2">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
