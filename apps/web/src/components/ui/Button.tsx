import React from "react";
import { cn } from "../../lib/cn.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "md" | "sm";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold rounded-md transition-[background-color,transform] focus-visible:outline-2 focus-visible:outline-ledger-900 focus-visible:outline-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
          size === "md" && "min-h-[44px] px-[18px] text-[0.9375rem]",
          size === "sm" && "min-h-[36px] px-3 text-[0.875rem]",
          variant === "primary" &&
            "bg-stamp-500 text-white hover:bg-stamp-600 disabled:bg-stamp-500/50",
          variant === "secondary" &&
            "bg-paper-0 text-ledger-900 border border-ledger-400 hover:bg-paper-100",
          variant === "destructive" &&
            "bg-loss-600 text-white hover:bg-loss-600/90 disabled:bg-loss-600/50",
          variant === "ghost" && "bg-transparent text-ledger-700 hover:bg-paper-100 hover:text-ledger-900",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
