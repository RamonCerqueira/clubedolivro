import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/30 border border-white/10",
      secondary: "text-foreground glass hover:bg-white/10",
      outline: "border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5",
      accent: "bg-accent text-black hover:bg-amber-400 shadow-xl shadow-accent/20",
      ghost: "text-neutral-500 hover:text-white hover:bg-white/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      icon: "p-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-2xl font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed",
          variants[variant as keyof typeof variants] || variants.primary,
          sizes[size as keyof typeof sizes] || sizes.md,
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
