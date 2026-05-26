import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  user?: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Avatar = ({ user, size = "md", className }: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  if (!user) {
    return (
      <div
        className={cn(
          sizes[size],
          "bg-white/10 rounded-full animate-pulse",
          className
        )}
      />
    );
  }

  const displayName = user.name || user.username || "";

  return (
    <div
      className={cn(
        sizes[size],
        "bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-inner shrink-0 overflow-hidden",
        className
      )}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        <span>{displayName.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export { Avatar };
