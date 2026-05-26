"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ForestScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
      {/* Background Image with slow zoom/pan */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: "url('/scary_forest_bg.png')"
        }}
      />

      {/* Deep dark vignette around the edges to blend smoothly */}
      <div className="absolute inset-0 shadow-[inset_0_0_250px_rgba(0,0,0,1)] bg-gradient-to-t from-black via-transparent to-black/80" />

      {/* Floating suspenseful particles (Ashes / Fireflies) */}
      {mounted && [...Array(40)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 12 + Math.random() * 20;
        const size = Math.random() * 4 + 1;
        const isEmerald = Math.random() > 0.5;
        
        return (
          <motion.div
            key={`particle-${i}`}
            initial={{ y: "110vh", x: 0, opacity: 0 }}
            animate={{
              y: "-10vh",
              x: [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
            className={`absolute rounded-full blur-[1px] ${isEmerald ? 'bg-emerald-400/80' : 'bg-teal-300/60'}`}
            style={{ 
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: isEmerald ? "0 0 12px rgba(52, 211, 153, 0.6)" : "0 0 10px rgba(45, 212, 191, 0.4)"
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroScene() {
  return <ForestScene />;
}
