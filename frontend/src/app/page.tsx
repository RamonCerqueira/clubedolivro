"use client";

import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Zap,
  Star,
  ArrowRight,
  MessageCircle,
  Trophy,
  Globe,
  Compass,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";

// Lazy load Three.js scene to avoid SSR issues
const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const features = [
  {
    icon: <Users className="text-primary" size={32} />,
    title: "Clubes Exclusivos",
    description: "Crie ou participe de comunidades focadas em seus gêneros literários favoritos."
  },
  {
    icon: <Zap className="text-yellow-500" size={32} />,
    title: "Leitura Gamificada",
    description: "Ganhe pontos, suba de nível e conquiste emblemas enquanto mergulha em novos mundos."
  },
  {
    icon: <MessageCircle className="text-secondary" size={32} />,
    title: "Discussões em Tempo Real",
    description: "Converse com outros leitores sobre aquele plot twist que te deixou sem fôlego."
  },
  {
    icon: <Globe className="text-emerald-500" size={32} />,
    title: "Comunidade Global",
    description: "Descubra o que pessoas ao redor do mundo estão lendo e compartilhando agora."
  }
];

const trendingClubs = [
  { name: "Ficção Científica", members: 1240, cover: "/premium_book_cover_sci_fi.png" },
  { name: "Clássicos Russos", members: 850, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" },
  { name: "Futurismo Árabe", members: 430, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400" }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Three.js Immersive Background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">A sua leitura em movimento</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              LEITURA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">EM MOVIMENTO.</span>
            </h1>

            <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-xl backdrop-blur-sm bg-black/30 rounded-2xl p-4 border border-white/5">
              Transforme o hábito solitário de ler em uma experiência coletiva épica. Junte-se a clubes, discuta plots e ganhe recompensas por sua jornada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button className="h-16 px-10 rounded-full bg-white text-black font-black text-lg hover:bg-white/90 shadow-2xl shadow-white/10 group transition-all">
                  COMEÇAR AGORA <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/explorar">
                <Button variant="outline" className="h-16 px-10 rounded-full border-border hover:bg-white/5 font-black text-lg backdrop-blur-md">
                   VER CLUBES
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-neutral-900 overflow-hidden ring-2 ring-primary/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-neutral-500 text-sm font-bold">
                <span className="text-white">+2.4k</span> leitores ativos agora
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:flex flex-col justify-center items-end h-[600px] overflow-hidden"
          >
             {/* Fade masks for top and bottom */}
             <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none"></div>
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
             
             <div className="flex flex-col gap-4 w-[420px] py-4 perspective-1000">
                {[
                  { icon: "👋", user: "Equipe Leituri", text: "Bem-vindo ao maior ecossistema de leitores do Brasil. Já escolheu seu próximo livro?", time: "Agora", isSystem: true },
                  { icon: "💬", user: "Ana Silva", text: "Gente, o Leituri me recomendou Duna e esse plot twist me destruiu...", time: "2 min" },
                  { icon: "📚", user: "Ramon", text: "Hahahaha te falei! O algoritmo de recomendação do Leituri nunca erra.", time: "5 min" },
                  { icon: "✨", user: "Julia", text: "Acabei de postar minha review lá no clube de Sci-Fi do Leituri! Deem upvote!", time: "12 min" },
                ].map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 50, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: i * 1.5 + 1, duration: 0.8, type: "spring" }}
                    className={`p-5 rounded-[2rem] max-w-[90%] shadow-2xl backdrop-blur-md border ${msg.isSystem ? 'bg-primary/20 border-primary/30 mx-auto text-center' : i%2 === 0 ? 'bg-white/5 border-white/10 ml-auto rounded-tr-sm' : 'bg-secondary/10 border-secondary/20 mr-auto rounded-tl-sm'}`}
                  >
                     {msg.isSystem ? (
                        <p className="text-white font-bold text-sm leading-relaxed">
                           <span className="text-xl mr-2">{msg.icon}</span> {msg.text}
                        </p>
                     ) : (
                        <div>
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                 <span className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-[10px] border border-white/10">{msg.icon}</span>
                                 {msg.user}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-bold">{msg.time}</span>
                           </div>
                           <p className="text-neutral-200 font-medium text-sm leading-relaxed">
                              {msg.text}
                           </p>
                        </div>
                     )}
                  </motion.div>
                ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-black/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: "15k+", label: "Páginas Lidas" },
              { val: "450+", label: "Clubes Ativos" },
              { val: "12k", label: "Membros" },
              { val: "2.4k", label: "Eventos" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h4 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.val}</h4>
                <p className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Bento Box Gamification */}
      <section className="py-32 container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
           <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">Seu progresso</p>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">LEIA. SUBA DE NÍVEL. <span className="text-primary">REPITA.</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
           {/* Streak Box */}
           <div className="md:col-span-2 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-black border border-primary/20 p-10 flex flex-col justify-between relative overflow-hidden group shadow-[0_0_40px_rgba(var(--primary),0.1)]">
              <div className="absolute -right-10 -top-10 opacity-20 text-primary group-hover:scale-110 transition-transform duration-700">
                 <Zap size={250} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">30 DIAS DE STREAK</h3>
                 <p className="text-primary font-bold uppercase tracking-widest text-xs">Fogo na leitura!</p>
              </div>
              <div className="flex gap-3 relative z-10">
                 {[...Array(7)].map((_, i) => (
                    <div key={i} className={`h-12 flex-1 rounded-xl shadow-inner ${i < 5 ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'bg-white/10'}`}></div>
                 ))}
              </div>
           </div>

           {/* Trophy Box */}
           <div className="rounded-[2.5rem] bg-neutral-900 border border-white/10 p-10 flex flex-col items-center justify-center text-center hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-500 ring-1 ring-yellow-500/50">
                 <Trophy size={40} />
              </div>
              <h3 className="text-xl font-black text-white uppercase">Mestre Sci-Fi</h3>
              <p className="text-neutral-500 text-sm mt-2 font-medium">10 livros lidos</p>
           </div>

           {/* Stats Box */}
           <div className="rounded-[2.5rem] bg-black border border-white/10 p-10 flex flex-col justify-center hover:bg-white/5 transition-colors">
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-2">Páginas Lidas</p>
              <h3 className="text-6xl font-black text-white tracking-tighter">14k<span className="text-primary">.</span></h3>
           </div>

           {/* Chat Box */}
           <div className="md:col-span-2 rounded-[2.5rem] bg-secondary/10 border border-secondary/20 p-10 overflow-hidden relative hover:border-secondary/40 transition-colors">
              <div className="absolute right-10 top-10 flex flex-col gap-4 opacity-60">
                 <div className="bg-white/10 p-4 rounded-2xl rounded-tr-none w-64 ml-auto text-sm text-white backdrop-blur-md">Esse plot twist do final me quebrou muito!!</div>
                 <div className="bg-secondary/20 p-4 rounded-2xl rounded-tl-none w-64 text-sm text-white border border-secondary/30 backdrop-blur-md">Né? Eu não esperava que ele fosse o traidor.</div>
              </div>
              <div className="relative z-10 w-full h-full flex flex-col justify-end pointer-events-none">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">SPOILERS LIBERADOS</h3>
                 <p className="text-secondary font-bold uppercase tracking-widest text-xs mt-2">Salas de chat por capítulo</p>
              </div>
           </div>
        </div>
      </section>

      {/* Vibe Selector */}
      <section className="py-32 container mx-auto px-6 relative z-10 text-center border-t border-white/5">
         <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-16 leading-[0.9]">
            O QUE VOCÊ QUER <br/><span className="text-primary italic">SENTIR</span> HOJE?
         </h2>
         <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {["TERROR PSICOLÓGICO", "FICÇÃO CIENTÍFICA", "ROMANCE ÁCIDO", "FANTASIA ÉPICA", "MISTÉRIO CLÁSSICO"].map((vibe, i) => (
               <button key={i} className="px-8 py-6 rounded-full bg-black border-2 border-white/10 text-white font-black text-xl hover:border-primary hover:text-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:-translate-y-2 transition-all">
                  {vibe}
               </button>
            ))}
         </div>
      </section>

      {/* Immersive Parallax Event Section */}
      <section className="relative py-40 min-h-[600px] flex items-center justify-center overflow-hidden bg-fixed bg-center bg-cover border-y border-white/10" style={{ backgroundImage: "url('/bg-book-club.png')" }}>
        {/* Overlays for contrast */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8 bg-black/30 p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center ring-1 ring-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
               <Users className="text-primary w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Debates que <span className="text-primary">transcendem</span> páginas.
            </h2>
            <p className="text-lg md:text-2xl text-neutral-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Experimente encontros hiper-imersivos. Salas de áudio e vídeo dedicadas para você conversar, rir e surtar com outros leitores sobre o seu livro favorito.
            </p>
            <div className="pt-4">
               <Link href="/register">
                 <Button className="h-16 px-10 rounded-full bg-white text-black font-black text-lg shadow-xl hover:scale-105 transition-transform">
                   PARTICIPAR DO PRÓXIMO EVENTO
                 </Button>
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Clubs */}
      <section className="py-32 bg-primary/5 border-y border-primary/10 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Compass size={400} className="text-primary" />
        </div>
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-secondary font-black uppercase tracking-[0.3em] text-xs">Explore o universo</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Clubes que estão <br/>bombando agora.</h2>
            </div>
            <Link href="/explorar">
              <Button className="rounded-full px-8 bg-white text-black font-black hover:bg-white/90 border border-border group h-14">
                EXPLORAR TODOS <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingClubs.map((club, i) => (
              <Card key={i} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-none">
                <img 
                  src={club.cover} 
                  alt={club.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <h4 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-snug">{club.name}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(j => (
                          <div key={j} className="w-8 h-8 rounded-full border-2 border-black bg-neutral-800 overflow-hidden ring-1 ring-white/10">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${j+i*5}`} alt="Member" />
                          </div>
                       ))}
                    </div>
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{club.members} MEMBROS</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 container mx-auto px-6 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
            Sua próxima grande <br />
            história começa <span className="text-primary italic">AQUI.</span>
          </h2>
          <div className="flex justify-center gap-6">
            <Link href="/register">
              <Button className="h-20 px-16 rounded-full bg-primary text-white font-black text-2xl hover:bg-primary-dark shadow-[0_20px_50px_rgba(80,70,229,0.3)] hover:shadow-primary/50 transition-all hover:scale-105">
                CRIAR MINHA CONTA
              </Button>
            </Link>
          </div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Gratuito para sempre. Diversão garantida.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 pb-32 md:pb-12 bg-black/90 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Leituri" width={32} height={32} className="rounded-xl object-contain" />
            <span className="font-black text-xl tracking-tighter text-white">Leituri</span>
          </div>
          <p className="text-neutral-600 text-sm font-medium">© 2026 Leituri. Design by Ramon & DeepMind.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
