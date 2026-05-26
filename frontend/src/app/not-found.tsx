"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Ghost } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 glass shadow-2xl relative group">
           <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
           <Ghost size={64} className="text-primary animate-bounce-slow" />
        </div>

        <h1 className="text-8xl md:text-9xl font-display font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
          Essa página se perdeu na estante.
        </h2>
        
        <p className="text-neutral-500 max-w-md mb-12 text-lg">
          O capítulo que você está procurando não existe ou foi movido para uma nova edição.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link href="/" className="flex-1">
                <Button fullWidth className="rounded-2xl py-6 bg-white text-black font-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-3">
                    <Home size={20} /> Voltar ao Início
                </Button>
            </Link>
            <Link href="/explorar" className="flex-1">
                <Button fullWidth variant="outline" className="rounded-2xl py-6 border-white/10 glass-card font-black hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                    <Search size={20} /> Explorar Clubes
                </Button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
