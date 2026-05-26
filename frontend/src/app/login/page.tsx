"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowRight, Facebook, MailMinusIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("ramon@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setAuth(data.user, data.access_token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Credenciais inválidas. Use ramon@example.com / 123456");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 md:p-10 glass-card border-border shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
              <LogIn size={32} />
            </div>
            <h1 className="text-3xl font-display font-black mb-2 text-foreground">Bem-vinda(o) de volta!</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Entre para continuar sua jornada literária.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full bg-foreground/[0.03] dark:bg-black/40 pl-12 pr-4 py-4 rounded-xl border border-border outline-none focus:border-primary/50 transition-all text-sm text-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-foreground/[0.03] dark:bg-black/40 pl-12 pr-4 py-4 rounded-xl border border-border outline-none focus:border-primary/50 transition-all text-sm text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
                type="submit" 
                fullWidth 
                disabled={loading}
                className="py-4 bg-gradient-to-r from-primary to-secondary font-black shadow-lg shadow-primary/20 hover:scale-[1.02]"
            >
              {loading ? "Entrando..." : "Entrar na Plataforma"} <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border space-y-4">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4">Ou continue com</p>
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass-card hover:bg-foreground/5 transition-all text-sm font-bold group">
                    <MailMinusIcon size={20} className="text-foreground group-hover:text-primary transition-colors" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl glass-card hover:bg-foreground/5 transition-all text-sm font-bold group">
                    <Facebook size={20} className="text-foreground group-hover:text-secondary transition-colors" /> Facebook
                </button>
            </div>
          </div>
          
          <p className="text-center mt-8 text-sm text-neutral-500">
            Não tem uma conta? <Link href="/register" className="text-primary font-bold hover:underline">Crie agora</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
