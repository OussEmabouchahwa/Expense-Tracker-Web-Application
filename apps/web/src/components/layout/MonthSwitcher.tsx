import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../ui/IconButton.js";
import { formatMonthName } from "../../lib/format.js";

export interface MonthSwitcherProps {
  currentMonth: string; // YYYY-MM
  onPrevMonth: () => void;
  onNextMonth: () => void;
  caption?: string;
  className?: string;
}

export const MonthSwitcher: React.FC<MonthSwitcherProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  caption,
  className,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <h1 className="font-serif font-semibold text-[1.75rem] leading-[1.2] tracking-[-0.01em] text-ledger-900 min-w-[9.5ch]">
          {formatMonthName(currentMonth)}
        </h1>
        <div className="flex items-center gap-0.5 ml-1">
          <IconButton onClick={onPrevMonth} aria-label="Previous month">
            <ChevronLeft className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={onNextMonth} aria-label="Next month">
            <ChevronRight className="w-5 h-5" />
          </IconButton>
        </div>
      </div>
      {caption && (
        <p className="font-sans text-[0.875rem] text-ledger-700 m-0">
          {caption}
        </p>
      )}
    </div>
  );
};
