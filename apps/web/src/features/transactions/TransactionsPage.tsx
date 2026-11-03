import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "../../components/ui/Input.js";
import { Select } from "../../components/ui/Select.js";
import { Button } from "../../components/ui/Button.js";
import {
  FIXTURE_TRANSACTIONS,
  FIXTURE_CATEGORIES,
  FIXTURE_ACCOUNTS,
} from "@masrouf/contracts";
import { formatMoney } from "../../lib/format.js";
import { TransactionFormData } from "./TransactionDrawer.js";
import { useToast } from "../../components/ui/Toast.js";

export interface TransactionsPageProps {
  onEditTransaction: (tx: TransactionFormData) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onEditTransaction,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");
  const [transactions, setTransactions] = useState(FIXTURE_TRANSACTIONS);

  const filtered = transactions.filter((tx) => {
    if (kindFilter !== "ALL" && tx.kind !== kindFilter) return false;
    if (categoryFilter !== "ALL" && tx.categoryId !== categoryFilter) return false;
    if (accountFilter !== "ALL" && tx.accountId !== accountFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchPayee = tx.payee.toLowerCase().includes(q);
      const matchNote = tx.note?.toLowerCase().includes(q);
      if (!matchPayee && !matchNote) return false;
    }
    return true;
  });

  const handleDelete = (id: string, payee: string) => {
    const deletedTx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted ${payee}.`, "Undo", () => {
      if (deletedTx) {
        setTransactions((prev) => [deletedTx, ...prev]);
      }
    });
  };

  const hasFilters =
    search.trim() !== "" ||
    kindFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    accountFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setKindFilter("ALL");
    setCategoryFilter("ALL");
    setAccountFilter("ALL");
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-5">
        <h1 className="font-serif font-semibold text-[1.75rem] leading-[1.2] tracking-[-0.01em] text-ledger-900">
          Transactions
        </h1>
        <span className="font-sans text-[0.875rem] text-ledger-700">
          {filtered.length} transaction{filtered.length === 1 ? "" : "s"} shown
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper-0 border border-line rounded-lg p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-ledger-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payee or note (Press /)"
              className="pl-9 min-h-[40px] text-[0.875rem]"
            />
          </div>

          {/* Kind */}
          <Select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="min-h-[40px] text-[0.875rem]"
          >
            <option value="ALL">All kinds</option>
            <option value="EXPENSE">Expenses only</option>
            <option value="INCOME">Income only</option>
          </Select>

          {/* Category */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-h-[40px] text-[0.875rem]"
          >
            <option value="ALL">All categories</option>
            {FIXTURE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Account */}
          <Select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="min-h-[40px] text-[0.875rem]"
          >
            <option value="ALL">All accounts</option>
            {FIXTURE_ACCOUNTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line text-[0.8125rem]">
            <Filter className="w-3.5 h-3.5 text-ledger-500" />
            <span className="text-ledger-700 font-medium">Filters active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-[0.75rem] text-stamp-700"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className="bg-paper-0 border border-line rounded-lg overflow-hidden">
        <table className="w-full border-collapse font-sans text-[0.9375rem]">
          <thead>
            <tr className="bg-ledger-100/50 border-b border-line text-ledger-700 text-[0.875rem]">
              <th className="py-2.5 px-4 text-left font-semibold">Date</th>
              <th className="py-2.5 px-4 text-left font-semibold">Payee</th>
              <th className="py-2.5 px-4 text-left font-semibold hidden sm:table-cell">Category</th>
              <th className="py-2.5 px-4 text-left font-semibold hidden md:table-cell">Account</th>
              <th className="py-2.5 px-4 text-right font-semibold">Amount (TND)</th>
              <th className="py-2.5 px-4 text-right w-12" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ledger-500">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isExpense = tx.kind === "EXPENSE";
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-line last:border-b-0 hover:bg-paper-50 transition-colors group cursor-pointer"
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
                  >
                    <td className="py-3 px-4 text-ledger-700 tabular-nums text-[0.875rem]">
                      {tx.occurredOn}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ledger-900">{tx.payee}</div>
                      {tx.note && (
                        <div className="text-[0.8125rem] text-ledger-700">{tx.note}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-ledger-700 hidden sm:table-cell">
                      {tx.categoryName}
                    </td>
                    <td className="py-3 px-4 text-ledger-700 hidden md:table-cell">
                      {tx.accountName}
                    </td>
                    <td
                      className={`py-3 px-4 text-right tabular-nums font-semibold ${
                        isExpense ? "text-ledger-900" : "text-gain-600"
                      }`}
                    >
                      {isExpense ? "−" : "+"}
                      {formatMoney(tx.amountMinor, "TND")}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDelete(tx.id, tx.payee)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-ledger-400 hover:text-loss-600 rounded transition-opacity"
                        aria-label={`Delete ${tx.payee}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
