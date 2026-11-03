import React from "react";
import { cn } from "../../lib/cn.js";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-grid place-items-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-md bg-transparent text-ledger-700 hover:bg-paper-100 hover:text-ledger-900 transition-colors focus-visible:outline-2 focus-visible:outline-ledger-900 focus-visible:outline-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
