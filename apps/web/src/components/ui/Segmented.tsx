import React from "react";
import { cn } from "../../lib/cn.js";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>): React.ReactElement {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex p-1 bg-paper-100 rounded-md border border-line gap-1",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-sm font-sans text-[0.875rem] font-semibold transition-all focus-visible:outline-2 focus-visible:outline-ledger-900 focus-visible:outline-offset-1",
              isSelected
                ? "bg-paper-0 text-ledger-900 shadow-sm"
                : "text-ledger-700 hover:text-ledger-900 hover:bg-paper-0/50"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
