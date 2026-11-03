import React, { useState } from "react";
import * as d3 from "d3-scale";
import * as shape from "d3-shape";
import { formatMoney } from "../../lib/format.js";

export interface SpendPoint {
  day: number;
  amountMinor: number;
  cumulativeMinor: number;
}

export interface SpendingPaceChartProps {
  thisMonthSpend: SpendPoint[];
  lastMonthSpend: SpendPoint[];
  todayDay: number;
  daysInMonth: number;
  daysInLastMonth: number;
  findingSentence: string;
  currency?: string;
  thisMonthLabel?: string;
  lastMonthLabel?: string;
}

export const SpendingPaceChart: React.FC<SpendingPaceChartProps> = ({
  thisMonthSpend,
  lastMonthSpend,
  todayDay,
  daysInMonth,
  daysInLastMonth,
  findingSentence,
  currency = "TND",
  thisMonthLabel = "Oct",
  lastMonthLabel = "Sep",
}) => {
  const [showTable, setShowTable] = useState(false);

  const width = 640;
  const height = 280;
  const margin = { top: 20, right: 85, bottom: 30, left: 55 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxDays = Math.max(daysInMonth, daysInLastMonth, 31);
  const maxSpend = Math.max(
    ...thisMonthSpend.map((d) => d.cumulativeMinor),
    ...lastMonthSpend.map((d) => d.cumulativeMinor),
    1000
  );

  // Clean tick max
  const yMax = Math.ceil(maxSpend / 500000) * 500000 || maxSpend;

  const xScale = d3.scaleLinear().domain([1, maxDays]).range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

  // Line generators
  const lineGen = shape
    .line<SpendPoint>()
    .x((d) => xScale(d.day))
    .y((d) => yScale(d.cumulativeMinor))
    .curve(shape.curveMonotoneX);

  const thisMonthPath = lineGen(thisMonthSpend) ?? "";
  const lastMonthPath = lineGen(lastMonthSpend) ?? "";

  const lastPointThis = thisMonthSpend[thisMonthSpend.length - 1];
  const lastPointLast = lastMonthSpend[lastMonthSpend.length - 1];

  const yTicks = yScale.ticks(4);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
        <p className="font-sans text-[0.9375rem] text-ledger-700 m-0">
          <span className="font-semibold text-ledger-900">{findingSentence}</span>
        </p>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="self-start sm:self-auto text-[0.8125rem] text-stamp-700 underline hover:text-stamp-600 focus-visible:outline-none"
        >
          {showTable ? "Hide table" : "View as table"}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto border border-line rounded-md bg-paper-0 p-3 my-2">
          <table className="w-full text-left text-[0.875rem] font-sans">
            <thead>
              <tr className="border-b border-line text-ledger-700">
                <th className="py-2">Day</th>
                <th className="py-2 text-right">{thisMonthLabel} Cumulative ({currency})</th>
                <th className="py-2 text-right">{lastMonthLabel} Cumulative ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: todayDay }, (_, i) => i + 1).map((d) => {
                const thisPt = thisMonthSpend.find((p) => p.day <= d)?.cumulativeMinor ?? 0;
                const lastPt = lastMonthSpend.find((p) => p.day <= d)?.cumulativeMinor ?? 0;
                return (
                  <tr key={d} className="border-b border-line/50 hover:bg-paper-50">
                    <td className="py-1.5 tabular-nums">Day {d}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatMoney(thisPt, currency)}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatMoney(lastPt, currency)}</td>
                  </tr>
                );
              })}
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
              {/* Horizontal grid lines */}
              {yTicks.map((tick) => (
                <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                  <line x1={0} x2={innerWidth} stroke="var(--line)" strokeWidth={1} />
                  <text
                    x={-8}
                    y={4}
                    textAnchor="end"
                    className="font-sans text-[11px] fill-ledger-500 tabular-nums select-none"
                  >
                    {formatMoney(tick, currency)}
                  </text>
                </g>
              ))}

              {/* Today line */}
              {todayDay && (
                <g transform={`translate(${xScale(todayDay)}, 0)`}>
                  <line
                    y1={0}
                    y2={innerHeight}
                    stroke="var(--ledger-400)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <text
                    x={0}
                    y={-6}
                    textAnchor="middle"
                    className="font-sans text-[10px] font-medium fill-ledger-500 uppercase select-none"
                  >
                    Today
                  </text>
                </g>
              )}

              {/* Last month comparison series */}
              <path
                d={lastMonthPath}
                fill="none"
                stroke="var(--chart-compare)"
                strokeWidth={1.75}
                strokeLinejoin="round"
              />

              {/* This month active expense series */}
              <path
                d={thisMonthPath}
                fill="none"
                stroke="var(--chart-expense)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dot on current position */}
              {lastPointThis && (
                <circle
                  cx={xScale(lastPointThis.day)}
                  cy={yScale(lastPointThis.cumulativeMinor)}
                  r={4}
                  className="fill-stamp-500 stroke-paper-0"
                  strokeWidth={2}
                />
              )}

              {/* End labels */}
              {lastPointThis && (
                <text
                  x={xScale(lastPointThis.day) + 8}
                  y={yScale(lastPointThis.cumulativeMinor) + 4}
                  className="font-sans text-[12px] font-semibold fill-stamp-700 tabular-nums select-none"
                >
                  {thisMonthLabel} {formatMoney(lastPointThis.cumulativeMinor, currency)}
                </text>
              )}

              {lastPointLast && (
                <text
                  x={xScale(lastPointLast.day) + 8}
                  y={yScale(lastPointLast.cumulativeMinor) + 4}
                  className="font-sans text-[11px] font-medium fill-ledger-500 tabular-nums select-none"
                >
                  {lastMonthLabel} {formatMoney(lastPointLast.cumulativeMinor, currency)}
                </text>
              )}

              {/* X-axis days */}
              {[1, 7, 14, 21, 28, maxDays].map((day) => (
                <text
                  key={day}
                  x={xScale(day)}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  className="font-sans text-[11px] fill-ledger-500 tabular-nums select-none"
                >
                  {day}
                </text>
              ))}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
