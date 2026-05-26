"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingTreeProps {
  totalPages: number;
}

export const ReadingTree: React.FC<ReadingTreeProps> = ({ totalPages }) => {
  // Define o estágio baseado nas páginas lidas
  let stage: "seed" | "sprout" | "young" | "tree" | "bloomed" = "seed";
  if (totalPages > 500) {
    stage = "bloomed";
  } else if (totalPages >= 300) {
    stage = "tree";
  } else if (totalPages >= 150) {
    stage = "young";
  } else if (totalPages >= 50) {
    stage = "sprout";
  }

  // Textos explicativos para cada estágio
  const stageDescriptions = {
    seed: {
      title: "A Semente Literária",
      desc: "Sua semente está guardada na terra quente. Leia mais 50 páginas para ver o primeiro broto de sabedoria surgir!",
      color: "from-amber-500 to-yellow-600",
    },
    sprout: {
      title: "O Broto de Sabedoria",
      desc: "Lindo! O conhecimento começou a germinar. Leia mais 100 páginas para os primeiros ramos se estenderem!",
      color: "from-green-400 to-emerald-600",
    },
    young: {
      title: "A Planta Jovem",
      desc: "Sua leitura diária está dando força aos ramos. Leia mais 150 páginas para formar uma árvore forte!",
      color: "from-teal-400 to-cyan-600",
    },
    tree: {
      title: "A Árvore do Conhecimento",
      desc: "Uma árvore robusta e cheia de vida! Leia mais 200 páginas para vê-la florescer com cores brilhantes!",
      color: "from-indigo-400 to-purple-600",
    },
    bloomed: {
      title: "A Árvore em Flor",
      desc: "Espetacular! Sua floresta mental está totalmente viva e florescida de pura inspiração e sabedoria!",
      color: "from-pink-500 to-rose-600",
    },
  };

  const activeDescription = stageDescriptions[stage];

  return (
    <div className="flex flex-col items-center justify-between p-6 rounded-3xl border border-white/8 bg-zinc-950/40 backdrop-blur-xl relative overflow-hidden h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Luzes de Fundo Estéticas */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[100px] opacity-20 bg-gradient-to-tr ${activeDescription.color} transition-all duration-1000`} />

      {/* Título do Estágio */}
      <div className="text-center z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Estágio de Leitura</span>
        <h3 className="text-xl font-extrabold text-white mt-1">{activeDescription.title}</h3>
      </div>

      {/* SVG Canvas da Árvore */}
      <div className="w-full flex items-center justify-center min-h-[220px] max-h-[260px] relative z-10 my-4 select-none">
        <svg viewBox="0 0 200 200" className="w-56 h-56">
          {/* Base de terra estática */}
          <path d="M 30 170 Q 100 160 170 170" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
          <path d="M 40 170 Q 100 155 160 170" stroke="rgba(255,255,255,0.04)" strokeWidth="2" fill="none" />

          <AnimatePresence mode="wait">
            {stage === "seed" && (
              <motion.g
                key="seed-g"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Semente enterrada brilhante */}
                <circle cx="100" cy="165" r="8" className="fill-amber-500/80 filter drop-shadow-[0_0_8px_#f59e0b]" />
                <path d="M 100 165 Q 98 160 100 156" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Partículas flutuantes de energia da terra */}
                <motion.circle
                  cx="92"
                  cy="162"
                  r="1.5"
                  className="fill-amber-400"
                  animate={{ y: [-2, -8, -2], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="108"
                  cy="160"
                  r="1.5"
                  className="fill-amber-400"
                  animate={{ y: [-4, -10, -4], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
                />
              </motion.g>
            )}

            {stage === "sprout" && (
              <motion.g
                key="sprout-g"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Pequeno caule brilhante surgindo da semente */}
                <motion.path
                  d="M 100 165 Q 102 145 96 135"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
                {/* Primeira folhinha esquerda */}
                <motion.path
                  d="M 97 142 Q 88 135 91 143 Z"
                  fill="#34d399"
                  className="filter drop-shadow-[0_0_4px_#34d399]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                />
                {/* Segunda folhinha direita */}
                <motion.path
                  d="M 98 137 Q 106 130 102 138 Z"
                  fill="#34d399"
                  className="filter drop-shadow-[0_0_4px_#34d399]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                />
              </motion.g>
            )}

            {stage === "young" && (
              <motion.g
                key="young-g"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tronco principal estendido */}
                <path d="M 100 165 Q 98 130 104 110" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Galho Esquerdo */}
                <path d="M 100 135 Q 85 125 78 122" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Galho Direito */}
                <path d="M 102 125 Q 115 115 124 112" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
                
                {/* Folhas vibrantes neon */}
                <circle cx="78" cy="122" r="5" className="fill-teal-400 filter drop-shadow-[0_0_5px_#2dd4bf]" />
                <circle cx="124" cy="112" r="4.5" className="fill-teal-400 filter drop-shadow-[0_0_5px_#2dd4bf]" />
                <circle cx="104" cy="110" r="5.5" className="fill-teal-400 filter drop-shadow-[0_0_5px_#2dd4bf]" />
              </motion.g>
            )}

            {stage === "tree" && (
              <motion.g
                key="tree-g"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tronco forte e estruturado */}
                <path d="M 100 167 C 96 140 92 110 100 85" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Galhos complexos */}
                <path d="M 97 130 Q 75 115 65 110" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 98 115 Q 120 100 132 95" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 99 98 Q 80 85 76 80" stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                
                {/* Folhas maiores e copas estilizadas */}
                <circle cx="65" cy="110" r="7" className="fill-purple-500 filter drop-shadow-[0_0_6px_#a855f7]" />
                <circle cx="132" cy="95" r="6" className="fill-purple-500 filter drop-shadow-[0_0_6px_#a855f7]" />
                <circle cx="76" cy="80" r="6.5" className="fill-purple-500 filter drop-shadow-[0_0_6px_#a855f7]" />
                <circle cx="100" cy="85" r="8" className="fill-purple-400 filter drop-shadow-[0_0_7px_#c084fc]" />
              </motion.g>
            )}

            {stage === "bloomed" && (
              <motion.g
                key="bloomed-g"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tronco majestoso iluminado */}
                <path d="M 100 167 C 96 135 94 95 100 70" stroke="#ec4899" strokeWidth="9" strokeLinecap="round" fill="none" />
                {/* Estrutura de Galhos Expandida */}
                <path d="M 97 125 C 70 110 60 95 50 85" stroke="#ec4899" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M 98 108 C 122 92 135 80 145 75" stroke="#ec4899" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 99 90 C 75 75 70 65 62 60" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 100 80 Q 115 62 122 55" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Copas e Folhas Rosas de Cerejeira / Flores de Conhecimento */}
                <circle cx="50" cy="85" r="9" className="fill-pink-500 filter drop-shadow-[0_0_8px_#ec4899]" />
                <circle cx="145" cy="75" r="8.5" className="fill-pink-500 filter drop-shadow-[0_0_8px_#ec4899]" />
                <circle cx="62" cy="60" r="8" className="fill-pink-400 filter drop-shadow-[0_0_8px_#f472b6]" />
                <circle cx="122" cy="55" r="7.5" className="fill-pink-400 filter drop-shadow-[0_0_8px_#f472b6]" />
                <circle cx="100" cy="70" r="10" className="fill-pink-500 filter drop-shadow-[0_0_10px_#ec4899]" />

                {/* Flores Desabrochadas em SVG */}
                <path d="M 100 60 Q 95 58 100 50 Q 105 58 100 60" fill="#fff" className="filter drop-shadow-[0_0_5px_#fff]" />
                <path d="M 50 78 Q 45 76 50 70 Q 55 76 50 78" fill="#fff" className="filter drop-shadow-[0_0_5px_#fff]" />
                <path d="M 145 68 Q 140 66 145 60 Q 150 66 145 68" fill="#fff" className="filter drop-shadow-[0_0_5px_#fff]" />

                {/* Partículas flutuantes estilo vaga-lume ou pétalas flutuantes */}
                <motion.circle
                  cx="40"
                  cy="75"
                  r="2"
                  className="fill-pink-300"
                  animate={{ y: [-5, -20, -5], x: [0, 8, 0], opacity: [0.1, 0.9, 0.1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="155"
                  cy="65"
                  r="1.5"
                  className="fill-pink-300"
                  animate={{ y: [-10, -30, -10], x: [0, -6, 0], opacity: [0.1, 0.9, 0.1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="105"
                  cy="45"
                  r="2"
                  className="fill-white"
                  animate={{ y: [-2, -15, -2], x: [0, 4, 0], opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Descrição e Progresso de Leitura */}
      <div className="w-full text-center z-10 bg-white/2 border border-white/5 p-4 rounded-2xl">
        <p className="text-xs font-semibold text-zinc-400 leading-relaxed mb-3">
          {activeDescription.desc}
        </p>
        
        {/* Barra de Progresso do Próximo Estágio */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold mb-1">
            <span>{totalPages} Lidas</span>
            <span>
              {totalPages < 50 ? "Broto (50 pág)" : 
               totalPages < 150 ? "Planta (150 pág)" : 
               totalPages < 300 ? "Árvore (300 pág)" : 
               totalPages < 500 ? "Florir (500 pág)" : "Nível Máximo!"}
            </span>
          </div>
          
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${activeDescription.color}`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(
                  100, 
                  totalPages < 50 ? (totalPages / 50) * 100 : 
                  totalPages < 150 ? ((totalPages - 50) / 100) * 100 : 
                  totalPages < 300 ? ((totalPages - 150) / 150) * 100 : 
                  totalPages < 500 ? ((totalPages - 300) / 200) * 100 : 100
                )}%` 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
