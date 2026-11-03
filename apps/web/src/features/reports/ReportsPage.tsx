import React, { useState } from "react";
import { Segmented } from "../../components/ui/Segmented.js";
import { SpendingPaceChart } from "../../components/charts/SpendingPaceChart.js";
import { MonthlyBars, MonthlyBarData } from "../../components/charts/MonthlyBars.js";
import { CategoryBars, CategorySpendData } from "../../components/charts/CategoryBars.js";
import { Button } from "../../components/ui/Button.js";
import { Download } from "lucide-react";
import { FIXTURE_SPENDING_PACE, FIXTURE_CATEGORIES } from "@masrouf/contracts";
import { useToast } from "../../components/ui/Toast.js";

const FIXTURE_12_MONTHS: MonthlyBarData[] = [
  { month: "2025-11", label: "Nov 25", incomeMinor: 3200000, expenseMinor: 1850000 },
  { month: "2025-12", label: "Dec 25", incomeMinor: 3500000, expenseMinor: 2400000 },
  { month: "2026-01", label: "Jan 26", incomeMinor: 3200000, expenseMinor: 1750000 },
  { month: "2026-02", label: "Feb 26", incomeMinor: 3200000, expenseMinor: 1680000 },
  { month: "2026-03", label: "Mar 26", incomeMinor: 3800000, expenseMinor: 2100000 },
  { month: "2026-04", label: "Apr 26", incomeMinor: 3200000, expenseMinor: 1950000 },
  { month: "2026-05", label: "May 26", incomeMinor: 3200000, expenseMinor: 1820000 },
  { month: "2026-06", label: "Jun 26", incomeMinor: 4100000, expenseMinor: 2600000 },
  { month: "2026-07", label: "Jul 26", incomeMinor: 3200000, expenseMinor: 2300000 },
  { month: "2026-08", label: "Aug 26", incomeMinor: 3200000, expenseMinor: 2450000 },
  { month: "2026-09", label: "Sep 26", incomeMinor: 3800000, expenseMinor: 1986950 },
  { month: "2026-10", label: "Oct 26", incomeMinor: 4050000, expenseMinor: 2146300 },
];

const FIXTURE_CATEGORY_SPEND: CategorySpendData[] = [
  { categoryId: FIXTURE_CATEGORIES[1]!.id, categoryName: "Loyer & Charges", totalMinor: 850000, sharePercent: 40 },
  { categoryId: FIXTURE_CATEGORIES[0]!.id, categoryName: "Alimentation & Courses", totalMinor: 610000, sharePercent: 28 },
  { categoryId: FIXTURE_CATEGORIES[2]!.id, categoryName: "Transport & Carburant", totalMinor: 245000, sharePercent: 11 },
  { categoryId: FIXTURE_CATEGORIES[3]!.id, categoryName: "Cafés & Sorties", totalMinor: 172000, sharePercent: 8 },
  { categoryId: FIXTURE_CATEGORIES[4]!.id, categoryName: "Factures & Internet", totalMinor: 120000, sharePercent: 6 },
  { categoryId: FIXTURE_CATEGORIES[5]!.id, categoryName: "Santé & Pharmacie", totalMinor: 85000, sharePercent: 4 },
  { categoryId: FIXTURE_CATEGORIES[7]!.id, categoryName: "Abonnements en ligne", totalMinor: 64300, sharePercent: 3 },
];

export const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [rangePreset, setRangePreset] = useState<string>("THIS_MONTH");

  const pace = FIXTURE_SPENDING_PACE;

  const handleExportCsv = () => {
    showToast("Exporting transactions as CSV…");
    // Trigger download or mock
    const csvContent = "Date,Payee,Category,Account,Kind,Amount\n2026-10-28,Carrefour Market,Alimentation & Courses,Courant BIAT,EXPENSE,114.350\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `masrouf-report-${rangePreset.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-semibold text-[1.75rem] leading-[1.2] tracking-[-0.01em] text-ledger-900">
            Financial Reports
          </h1>
          <p className="font-sans text-[0.875rem] text-ledger-700 mt-1">
            Visual summaries and spending pace analysis.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Segmented
            value={rangePreset}
            onChange={setRangePreset}
            options={[
              { value: "THIS_MONTH", label: "This month" },
              { value: "LAST_MONTH", label: "Last month" },
              { value: "12_MONTHS", label: "12 months" },
            ]}
          />
          <Button variant="secondary" size="sm" onClick={handleExportCsv} className="gap-1.5">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Report Section 1: Spending Pace */}
      <section className="bg-paper-0 border border-line rounded-lg p-5 md:p-6 mb-6">
        <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-1">
          Spending pace comparison
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
      </section>

      {/* Report Section 2: 12-Month Trend */}
      <section className="bg-paper-0 border border-line rounded-lg p-5 md:p-6 mb-6">
        <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-1">
          12-Month income vs expense trend
        </h2>
        <MonthlyBars
          data={FIXTURE_12_MONTHS}
          currency="TND"
          findingSentence="Average monthly net savings over the past 12 months is +1,240.500 DT."
        />
      </section>

      {/* Report Section 3: Ranked Category Spend */}
      <section className="bg-paper-0 border border-line rounded-lg p-5 md:p-6">
        <h2 className="font-serif text-[1.1875rem] font-semibold text-ledger-900 mb-1">
          Spending by category
        </h2>
        <CategoryBars
          data={FIXTURE_CATEGORY_SPEND}
          currency="TND"
          findingSentence="Housing & groceries represent 68% of all expenses in October."
        />
      </section>
    </main>
  );
};
