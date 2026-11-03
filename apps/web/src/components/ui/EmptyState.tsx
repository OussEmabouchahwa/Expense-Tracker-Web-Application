import React from "react";
import { cn } from "../../lib/cn.js";

export interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-paper-0 border border-line rounded-lg my-4",
        className
      )}
    >
      {title && (
        <h3 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-2">
          {title}
        </h3>
      )}
      <p className="font-sans text-[0.9375rem] text-ledger-700 max-w-[45ch]">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
