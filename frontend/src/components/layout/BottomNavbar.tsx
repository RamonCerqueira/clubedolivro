"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Compass, Calendar, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Feed", icon: Compass, href: "/dashboard/feed" },
  { label: "Eventos", icon: Calendar, href: "/dashboard/events" },
  { label: "Chat", icon: MessageCircle, href: "/dashboard/chat" }, 
  { label: "Perfil", icon: User, href: "/dashboard/profile" },
];

export function BottomNavbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/chat");

  if (isDashboard) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-t-[2.5rem] border-t border-white/10 px-6 py-3 pb-8 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="relative flex flex-col items-center gap-1 group"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              isActive ? "bg-primary/20 text-primary scale-110" : "text-neutral-500 group-hover:text-white"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
