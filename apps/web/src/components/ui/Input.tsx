import React from "react";
import { cn } from "../../lib/cn.js";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full min-h-[44px] px-3 py-2 rounded-md bg-paper-0 text-ledger-900 border text-[0.9375rem] font-sans transition-colors placeholder:text-ledger-300 focus-visible:outline-2 focus-visible:outline-ledger-900 focus-visible:outline-offset-2 disabled:bg-paper-100 disabled:text-ledger-300 disabled:cursor-not-allowed",
          hasError
            ? "border-loss-600 focus-visible:outline-loss-600"
            : "border-ledger-400 hover:border-ledger-700",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
