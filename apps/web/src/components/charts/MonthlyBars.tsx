import React, { useState } from "react";
import * as d3 from "d3-scale";
import { formatMoney } from "../../lib/format.js";

export interface MonthlyBarData {
  month: string; // YYYY-MM
  label: string; // "Oct 25", etc.
  incomeMinor: number;
  expenseMinor: number;
}

export interface MonthlyBarsProps {
  data: MonthlyBarData[];
  currency?: string;
  findingSentence?: string;
}

export const MonthlyBars: React.FC<MonthlyBarsProps> = ({
  data,
  currency = "TND",
  findingSentence = "Monthly income and expense history over the past 12 months.",
}) => {
  const [showTable, setShowTable] = useState(false);

  const width = 640;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 30, left: 55 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.incomeMinor, d.expenseMinor)),
    1000
  );
  const yMax = Math.ceil(maxVal / 500000) * 500000 || maxVal;

  const x0Scale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerWidth])
    .padding(0.25);

  const x1Scale = d3
    .scaleBand()
    .domain(["income", "expense"])
    .range([0, x0Scale.bandwidth()])
    .padding(0.1);

  const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

  const yTicks = yScale.ticks(4);

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
                <th className="py-2">Month</th>
                <th className="py-2 text-right">Income ({currency})</th>
                <th className="py-2 text-right">Expense ({currency})</th>
                <th className="py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.month} className="border-b border-line/50 hover:bg-paper-50">
                  <td className="py-1.5">{d.label}</td>
                  <td className="py-1.5 text-right tabular-nums text-gain-600">
                    +{formatMoney(d.incomeMinor, currency)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    −{formatMoney(d.expenseMinor, currency)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-semibold">
                    {formatMoney(d.incomeMinor - d.expenseMinor, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <svg
            role="img"
            aria-label={findingSentence}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block"
          >
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {yTicks.map((t) => (
                <g key={t} transform={`translate(0, ${yScale(t)})`}>
                  <line x1={0} x2={innerWidth} stroke="var(--line)" strokeWidth={1} />
                  <text
                    x={-8}
                    y={4}
                    textAnchor="end"
                    className="font-sans text-[11px] fill-ledger-500 tabular-nums select-none"
                  >
                    {formatMoney(t, currency)}
                  </text>
                </g>
              ))}

              {/* Bars */}
              {data.map((d) => {
                const groupX = x0Scale(d.label) ?? 0;
                const incomeW = x1Scale.bandwidth();
                const expenseW = x1Scale.bandwidth();

                return (
                  <g key={d.month} transform={`translate(${groupX}, 0)`}>
                    {/* Income bar */}
                    <rect
                      x={x1Scale("income") ?? 0}
                      y={yScale(d.incomeMinor)}
                      width={incomeW}
                      height={Math.max(0, innerHeight - yScale(d.incomeMinor))}
                      className="fill-ledger-700"
                      rx={2}
                    />
                    {/* Expense bar */}
                    <rect
                      x={x1Scale("expense") ?? 0}
                      y={yScale(d.expenseMinor)}
                      width={expenseW}
                      height={Math.max(0, innerHeight - yScale(d.expenseMinor))}
                      className="fill-stamp-500"
                      rx={2}
                    />
                    {/* X axis month label */}
                    <text
                      x={x0Scale.bandwidth() / 2}
                      y={innerHeight + 18}
                      textAnchor="middle"
                      className="font-sans text-[10px] fill-ledger-500 select-none"
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
