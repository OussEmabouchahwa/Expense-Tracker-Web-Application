import React from "react";
import { formatMoney, formatSignedMoney } from "../../lib/format.js";

export interface StatementBandProps {
  incomeMinor: number;
  expenseMinor: number;
  netMinor: number;
  savingsRate: number;
  currency?: string;
  className?: string;
}

export const StatementBand: React.FC<StatementBandProps> = ({
  incomeMinor,
  expenseMinor,
  netMinor,
  savingsRate,
  currency = "TND",
  className,
}) => {
  const netSigned = formatSignedMoney(netMinor, currency);

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 bg-paper-0 border border-line rounded-lg overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Income */}
      <div className="p-4 md:px-6 md:py-4.5 border-b md:border-b-0 md:border-r border-line">
        <small className="block font-sans text-[0.875rem] text-ledger-700">
          Income
        </small>
        <b className="font-serif font-semibold text-[1.75rem] leading-[1.25] tabular-nums text-gain-600">
          +{formatMoney(incomeMinor, currency)}
        </b>
      </div>

      {/* Expenses */}
      <div className="p-4 md:px-6 md:py-4.5 border-b md:border-b-0 md:border-r border-line">
        <small className="block font-sans text-[0.875rem] text-ledger-700">
          Expenses
        </small>
        <b className="font-serif font-semibold text-[1.75rem] leading-[1.25] tabular-nums text-ledger-900">
          −{formatMoney(expenseMinor, currency)}
        </b>
      </div>

      {/* Net */}
      <div className="p-4 md:px-6 md:py-4.5 border-r border-line">
        <small className="block font-sans text-[0.875rem] text-ledger-700">
          Net
        </small>
        <b
          className={`font-serif font-semibold text-[1.75rem] leading-[1.25] tabular-nums ${
            netMinor > 0
              ? "text-gain-600"
              : netMinor < 0
              ? "text-loss-600"
              : "text-ledger-900"
          }`}
        >
          {netSigned.fullFormatted}
        </b>
      </div>

      {/* Savings rate */}
      <div className="p-4 md:px-6 md:py-4.5">
        <small className="block font-sans text-[0.875rem] text-ledger-700">
          Savings rate
        </small>
        <b className="font-serif font-semibold text-[1.75rem] leading-[1.25] tabular-nums text-ledger-900">
          {savingsRate}%
        </b>
      </div>
    </div>
  );
};
