import React, { useState } from "react";
import { formatMoney } from "../../lib/format.js";

export interface CategorySpendData {
  categoryId: string;
  categoryName: string;
  totalMinor: number;
  sharePercent: number;
}

export interface CategoryBarsProps {
  data: CategorySpendData[];
  currency?: string;
  findingSentence?: string;
}

export const CategoryBars: React.FC<CategoryBarsProps> = ({
  data,
  currency = "TND",
  findingSentence = "Spending breakdown ranked by category.",
}) => {
  const [showTable, setShowTable] = useState(false);

  const maxMinor = Math.max(...data.map((d) => d.totalMinor), 1);

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-3">
        <p className="font-sans text-[0.9375rem] text-ledger-700 m-0">
          <span className="font-semibold text-ledger-900">{findingSentence}</span>
        </p>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="text-[0.8125rem] text-stamp-700 underline hover:text-stamp-600 focus-visible:outline-none"
        >
          {showTable ? "Hide table" : "View as table"}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto border border-line rounded-md bg-paper-0 p-3 my-2">
          <table className="w-full text-left text-[0.875rem] font-sans">
            <thead>
              <tr className="border-b border-line text-ledger-700">
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Amount ({currency})</th>
                <th className="py-2 text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.categoryId} className="border-b border-line/50 hover:bg-paper-50">
                  <td className="py-1.5 font-medium">{d.categoryName}</td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatMoney(d.totalMinor, currency)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">{d.sharePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-3 py-2">
          {data.map((item) => {
            const barWidth = Math.min(100, (item.totalMinor / maxMinor) * 100);
            return (
              <div key={item.categoryId} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline text-[0.875rem] font-sans">
                  <span className="font-medium text-ledger-900">{item.categoryName}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-semibold text-ledger-900">
                      {formatMoney(item.totalMinor, currency)}
                    </span>
                    <span className="text-ledger-500 text-[0.8125rem] tabular-nums">
                      ({item.sharePercent}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-ledger-200 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-stamp-500 rounded-sm"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
