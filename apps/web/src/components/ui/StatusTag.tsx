import React from "react";
import { cn } from "../../lib/cn.js";

export type StatusTagVariant =
  | "on_pace"
  | "ahead"
  | "over"
  | "upcoming"
  | "favorable"
  | "unfavorable"
  | "neutral";

export interface StatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusTagVariant;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  className,
  variant = "neutral",
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[9px] py-[1px] h-[22px] rounded-full text-[0.8125rem] font-semibold leading-none whitespace-nowrap",
        variant === "on_pace" && "bg-ledger-100 text-ledger-700",
        variant === "ahead" && "bg-warn-100 text-warn-700",
        variant === "over" && "bg-loss-100 text-loss-600",
        variant === "upcoming" && "bg-ledger-100 text-ledger-500",
        variant === "favorable" && "bg-gain-100 text-gain-600",
        variant === "unfavorable" && "bg-loss-100 text-loss-600",
        variant === "neutral" && "bg-ledger-100 text-ledger-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
