"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  ChevronDown,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/chat");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (isDashboard) return null;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-background/70 shadow-lg border-b border-border shadow-black/5 dark:shadow-black/40 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Leituri"
            width={40}
            height={40}
            className="rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform object-contain"
          />
          <span className="font-black text-2xl tracking-tighter text-foreground">Leituri</span>
        </Link>

        {/* Desktop Links (Hidden in Dashboard) */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            <Link href="/" className={cn("hover:text-foreground transition-colors", pathname === "/" && "text-primary")}>Início</Link>
            {isAuthenticated && (
              <Link href="/dashboard/feed" className={cn("hover:text-foreground transition-colors", pathname === "/dashboard/feed" && "text-primary")}>Feed</Link>
            )}
            <Link href={isAuthenticated ? "/dashboard/clubs" : "/explorar"} className={cn("hover:text-foreground transition-colors", (pathname === "/explorar" || pathname?.startsWith("/dashboard/clubs")) && "text-primary")}>Clubes</Link>
            <Link href={isAuthenticated ? "/dashboard/events" : "/eventos"} className={cn("hover:text-foreground transition-colors", (pathname === "/eventos" || pathname?.startsWith("/dashboard/events")) && "text-primary")}>Eventos</Link>
          </div>
        )}

        {/* Theme & Auth Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all outline-none"
              >
                <Avatar user={user} className="w-9 h-9 border border-border shadow-lg" />
                <div className="hidden lg:block text-left mr-2">
                  <p className="text-sm font-bold text-foreground leading-none whitespace-nowrap">{user.username}</p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Nível {user.level || 1}</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-neutral-500 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-64 bg-background/95 backdrop-blur-3xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-border mb-2">
                       <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Conta Ativa</p>
                       <p className="font-bold text-foreground truncate text-sm">{user.email}</p>
                    </div>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-foreground/5 text-neutral-600 dark:text-neutral-300 hover:text-foreground transition-all font-bold group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <UserIcon size={16} className="text-primary" />
                      </div>
                      Perfil Literário
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-neutral-300 hover:text-white transition-all font-bold group">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <Compass size={16} className="text-secondary" />
                      </div>
                      Dashboard
                    </Link>
                    <div className="h-px bg-white/5 my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 transition-all font-bold"
                    >
                      <LogOut size={18} /> Sair da conta
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button variant="ghost" className="rounded-full px-6 text-foreground font-black hover:bg-foreground/5 transition-all text-xs uppercase tracking-widest h-11 hidden sm:flex">
                  CADASTRAR
                </Button>
              </Link>
              <Link href="/login">
                <Button className="rounded-full px-8 bg-foreground text-background font-black hover:bg-primary hover:text-white shadow-xl shadow-foreground/5 transition-all text-xs uppercase tracking-widest px-10 h-11">
                  ENTRAR
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-2xl z-50 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
           {!isDashboard && (
             <>
               <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors py-4 border-b border-border">INÍCIO</Link>
               {isAuthenticated && (
                 <Link href="/dashboard/feed" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors py-4 border-b border-border">FEED SOCIAL</Link>
               )}
               <Link href={isAuthenticated ? "/dashboard/clubs" : "/explorar"} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors py-4 border-b border-border">CLUBES</Link>
               <Link href={isAuthenticated ? "/dashboard/events" : "/eventos"} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors py-4 border-b border-border">EVENTOS</Link>
             </>
           )}
           {user && (
             <button onClick={handleLogout} className="text-2xl font-black text-rose-500 py-4 mt-auto">SAIR DA CONTA</button>
           )}
        </div>
      )}
    </nav>
  );
};
