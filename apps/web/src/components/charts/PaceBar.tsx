import React from "react";
import { cn } from "../../lib/cn.js";
import { StatusTag } from "../ui/StatusTag.js";
import { formatMoney } from "../../lib/format.js";
import { BudgetStatus } from "@masrouf/contracts";

export interface PaceBarProps {
  categoryName: string;
  spentMinor: number;
  limitMinor: number;
  expectedFraction: number; // 0 to 1
  status: BudgetStatus;
  currency?: string;
  dayOfMonth?: number;
  daysInMonth?: number;
  overByMinor?: number;
  className?: string;
  onEditLimit?: () => void;
}

export const PaceBar: React.FC<PaceBarProps> = ({
  categoryName,
  spentMinor,
  limitMinor,
  expectedFraction,
  status,
  currency = "TND",
  dayOfMonth,
  daysInMonth,
  overByMinor,
  className,
  onEditLimit,
}) => {
  const isOver = status === "OVER";
  const spentPercent = limitMinor > 0 ? (spentMinor / limitMinor) * 100 : 0;
  const clampedFillPercent = Math.min(100, Math.max(0, spentPercent));
  const tickPercent = Math.min(100, Math.max(0, expectedFraction * 100));

  const tagVariant =
    status === "OVER" ? "over" : status === "AHEAD" ? "ahead" : "on_pace";

  const tagLabel =
    status === "OVER"
      ? `Over by ${formatMoney(overByMinor ?? spentMinor - limitMinor, currency)}`
      : status === "AHEAD"
      ? "Ahead of pace"
      : "On pace";

  return (
    <div className={cn("py-3.5 border-t border-line first:border-t-0", className)}>
      <div className="flex items-baseline justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-sans font-semibold text-[0.9375rem] text-ledger-900">
            {categoryName}
          </span>
          {onEditLimit && (
            <button
              type="button"
              onClick={onEditLimit}
              className="text-[0.75rem] text-stamp-700 underline hover:text-stamp-600 focus-visible:outline-none"
            >
              edit
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[0.875rem] text-ledger-700 tabular-nums">
            {formatMoney(spentMinor, currency)} of {formatMoney(limitMinor, currency)}
          </span>
          <StatusTag variant={tagVariant}>{tagLabel}</StatusTag>
        </div>
      </div>

      {/* Progress track with pace tick */}
      <div className="relative h-2.5 my-2.5 rounded-sm bg-ledger-200">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-sm transition-all",
            isOver ? "bg-loss-600" : "bg-ledger-700"
          )}
          style={{ width: `${clampedFillPercent}%` }}
        />
        {expectedFraction > 0 && expectedFraction <= 1 && (
          <div
            title={`Expected pace: ${Math.round(tickPercent)}%`}
            className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-ledger-900 rounded-[1px] select-none"
            style={{ left: `${tickPercent}%` }}
          />
        )}
      </div>

      {dayOfMonth && daysInMonth && (
        <div className="flex justify-between text-[0.75rem] text-ledger-500 font-sans">
          <span>Day {dayOfMonth} of {daysInMonth}</span>
          <span>{Math.round(spentPercent)}% spent</span>
        </div>
      )}
    </div>
  );
};
