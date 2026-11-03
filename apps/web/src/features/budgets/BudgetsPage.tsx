import React, { useState } from "react";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher.js";
import { PaceBar } from "../../components/charts/PaceBar.js";
import { Button } from "../../components/ui/Button.js";
import { FIXTURE_BUDGETS, FIXTURE_CATEGORIES } from "@masrouf/contracts";
import { formatMoney } from "../../lib/format.js";
import { Copy } from "lucide-react";
import { useToast } from "../../components/ui/Toast.js";

export const BudgetsPage: React.FC = () => {
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState("2026-10");
  const [budgets, setBudgets] = useState(FIXTURE_BUDGETS);

  const budgetedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const unbudgetedCategories = FIXTURE_CATEGORIES.filter(
    (c) => c.kind === "EXPENSE" && !budgetedCategoryIds.has(c.id)
  );

  const totalLimitMinor = budgets.reduce((acc, b) => acc + b.limitMinor, 0);
  const totalSpentMinor = budgets.reduce((acc, b) => acc + b.spentMinor, 0);

  const handleCopyPrevious = () => {
    showToast("Budgets copied from September 2026.");
  };

  const handleSetBudget = (categoryId: string, categoryName: string) => {
    const newBudget = {
      categoryId,
      categoryName,
      limitMinor: 200000,
      spentMinor: 0,
      status: "ON_PACE" as const,
      leftMinor: 200000,
    };
    setBudgets((prev) => [...prev, newBudget]);
    showToast(`Set budget of 200.000 DT for ${categoryName}.`);
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <MonthSwitcher
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth("2026-09")}
          onNextMonth={() => setCurrentMonth("2026-11")}
          caption="Pace marker at day 28 of 31"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyPrevious}
          className="gap-2 self-start sm:self-auto"
        >
          <Copy className="w-4 h-4" />
          <span>Copy from previous month</span>
        </Button>
      </div>

      {/* Monthly Budget Summary card */}
      <div className="bg-paper-0 border border-line rounded-lg p-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-sans text-[0.875rem] text-ledger-700">Total monthly budget</span>
          <div className="font-serif text-[1.75rem] font-semibold text-ledger-900 tabular-nums">
            {formatMoney(totalSpentMinor, "TND")} <span className="text-ledger-500 text-[1.125rem]">of {formatMoney(totalLimitMinor, "TND")}</span>
          </div>
        </div>
        <div className="font-sans text-[0.875rem] text-ledger-700 text-right">
          Remaining safe to spend: <b className="text-ledger-900">{formatMoney(Math.max(0, totalLimitMinor - totalSpentMinor), "TND")} DT</b>
        </div>
      </div>

      {/* Active Budgets List */}
      <div className="bg-paper-0 border border-line rounded-lg p-5 md:p-6 mb-6">
        <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-2">
          Category budgets
        </h2>
        <div className="flex flex-col">
          {budgets.map((b) => (
            <PaceBar
              key={b.categoryId}
              categoryName={b.categoryName}
              spentMinor={b.spentMinor}
              limitMinor={b.limitMinor}
              expectedFraction={28 / 31}
              status={b.status}
              overByMinor={b.overByMinor}
              dayOfMonth={28}
              daysInMonth={31}
              currency="TND"
            />
          ))}
        </div>
      </div>

      {/* Unbudgeted categories */}
      {unbudgetedCategories.length > 0 && (
        <div className="bg-paper-0 border border-line rounded-lg p-5 md:p-6">
          <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-1">
            Unbudgeted expense categories
          </h2>
          <p className="font-sans text-[0.875rem] text-ledger-700 mb-4">
            Categories without a spending limit this month.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unbudgetedCategories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 border border-line rounded-md bg-paper-50"
              >
                <span className="font-sans text-[0.875rem] font-medium text-ledger-900">
                  {c.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSetBudget(c.id, c.name)}
                >
                  Set budget
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
