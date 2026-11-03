import React, { useState } from "react";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher.js";
import { StatementBand } from "../../components/layout/StatementBand.js";
import { SpendingPaceChart } from "../../components/charts/SpendingPaceChart.js";
import { PaceBar } from "../../components/charts/PaceBar.js";
import {
  FIXTURE_SUMMARY,
  FIXTURE_BUDGETS,
  FIXTURE_SPENDING_PACE,
  FIXTURE_TRANSACTIONS,
} from "@masrouf/contracts";
import { formatMoney } from "../../lib/format.js";
import { TransactionFormData } from "../transactions/TransactionDrawer.js";

export interface OverviewPageProps {
  onEditTransaction: (tx: TransactionFormData) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onEditTransaction }) => {
  const [currentMonth, setCurrentMonth] = useState("2026-10");

  const summary = FIXTURE_SUMMARY;
  const budgets = FIXTURE_BUDGETS;
  const pace = FIXTURE_SPENDING_PACE;
  const recentTransactions = FIXTURE_TRANSACTIONS.slice(0, 5);

  const expectedFrac = 28 / 31;

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      {/* Month header */}
      <MonthSwitcher
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth("2026-09")}
        onNextMonth={() => setCurrentMonth("2026-11")}
        caption="Day 28 of 31 · 3 days left"
        className="mb-5"
      />

      {/* Statement Band */}
      <StatementBand
        incomeMinor={summary.current.incomeMinor}
        expenseMinor={summary.current.expenseMinor}
        netMinor={summary.current.netMinor}
        savingsRate={summary.current.savingsRate}
        currency="TND"
        className="mb-5"
      />

      {/* Grid: Pace Chart + Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5 mb-5">
        {/* Spending pace panel */}
        <div className="bg-paper-0 border border-line rounded-lg p-5 md:p-6">
          <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-1">
            Spending pace
          </h2>
          <SpendingPaceChart
            thisMonthSpend={pace.thisMonthSpendByDay}
            lastMonthSpend={pace.lastMonthSpendByDay}
            todayDay={pace.dayOfMonth}
            daysInMonth={pace.daysInMonth}
            daysInLastMonth={pace.daysInPreviousMonth}
            findingSentence={pace.findingSentence}
            currency="TND"
            thisMonthLabel="Oct"
            lastMonthLabel="Sep"
          />
        </div>

        {/* Budgets panel */}
        <div className="bg-paper-0 border border-line rounded-lg p-5 md:p-6">
          <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-3">
            Budgets
          </h2>
          <div className="flex flex-col">
            {budgets.map((b) => (
              <PaceBar
                key={b.categoryId}
                categoryName={b.categoryName}
                spentMinor={b.spentMinor}
                limitMinor={b.limitMinor}
                expectedFraction={expectedFrac}
                status={b.status}
                overByMinor={b.overByMinor}
                dayOfMonth={28}
                daysInMonth={31}
                currency="TND"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions panel */}
      <div className="bg-paper-0 border border-line rounded-lg p-5 md:p-6">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900">
            Recent transactions
          </h2>
          <span className="font-sans text-[0.8125rem] text-ledger-500">
            Currency: TND
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-[0.9375rem]">
            <thead>
              <tr className="border-b border-line text-ledger-700 text-[0.875rem]">
                <th className="py-2 pr-3 text-left font-semibold">Date</th>
                <th className="py-2 pr-3 text-left font-semibold">Payee</th>
                <th className="py-2 pr-3 text-left font-semibold hidden sm:table-cell">Category</th>
                <th className="py-2 pr-3 text-left font-semibold hidden md:table-cell">Account</th>
                <th className="py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => {
                const isExpense = tx.kind === "EXPENSE";
                return (
                  <tr
                    key={tx.id}
                    onClick={() =>
                      onEditTransaction({
                        id: tx.id,
                        kind: tx.kind,
                        amountMinor: tx.amountMinor,
                        payee: tx.payee,
                        categoryId: tx.categoryId,
                        accountId: tx.accountId,
                        occurredOn: tx.occurredOn,
                        note: tx.note ?? undefined,
                      })
                    }
                    className="border-b border-line last:border-b-0 hover:bg-paper-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-3 text-ledger-700 tabular-nums text-[0.875rem]">
                      {tx.occurredOn}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-ledger-900">{tx.payee}</div>
                      {tx.note && (
                        <div className="text-[0.8125rem] text-ledger-700">{tx.note}</div>
                      )}
                    </td>
                    <td className="py-3 pr-3 text-ledger-700 hidden sm:table-cell">
                      {tx.categoryName}
                    </td>
                    <td className="py-3 pr-3 text-ledger-700 hidden md:table-cell">
                      {tx.accountName}
                    </td>
                    <td
                      className={`py-3 text-right tabular-nums font-semibold ${
                        isExpense ? "text-ledger-900" : "text-gain-600"
                      }`}
                    >
                      {isExpense ? "−" : "+"}
                      {formatMoney(tx.amountMinor, "TND")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
