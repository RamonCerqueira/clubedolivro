"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
    );
  }

  const themes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;
        
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
              isActive 
                ? "bg-white text-black shadow-lg scale-110 shadow-primary/20" 
                : "text-neutral-500 hover:text-white hover:bg-white/5"
            )}
            title={`Alternar para modo ${t.name}`}
          >
            <Icon size={16} strokeWidth={isActive ? 3 : 2} />
          </button>
        );
      })}
    </div>
  );
};
