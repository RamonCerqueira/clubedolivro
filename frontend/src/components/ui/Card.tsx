import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl border border-border overflow-hidden transition-colors duration-300",
          glass ? "glass" : "bg-background",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
