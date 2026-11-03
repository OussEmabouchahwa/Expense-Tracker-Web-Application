import React from "react";
import { FIXTURE_ACCOUNTS } from "@masrouf/contracts";
import { formatMoney } from "../../lib/format.js";
import { Button } from "../../components/ui/Button.js";
import { Plus, Wallet, Building2, CreditCard } from "lucide-react";
import { useToast } from "../../components/ui/Toast.js";

export const AccountsPage: React.FC = () => {
  const { showToast } = useToast();
  const accounts = FIXTURE_ACCOUNTS;

  const totalBalanceMinor = accounts.reduce((acc, a) => acc + a.balanceMinor, 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "BANK":
        return <Building2 className="w-5 h-5 text-ledger-700" />;
      case "CARD":
        return <CreditCard className="w-5 h-5 text-ledger-700" />;
      case "CASH":
      default:
        return <Wallet className="w-5 h-5 text-ledger-700" />;
    }
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 pb-18 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-semibold text-[1.75rem] leading-[1.2] tracking-[-0.01em] text-ledger-900">
            Accounts
          </h1>
          <p className="font-sans text-[0.875rem] text-ledger-700 mt-1">
            Cash, bank accounts, cards and current balances.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast("Account management modal will open.")}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add account</span>
        </Button>
      </div>

      {/* Net Worth Summary */}
      <div className="bg-paper-0 border border-line rounded-lg p-5 mb-6">
        <span className="font-sans text-[0.875rem] text-ledger-700">Total liquid balance</span>
        <div className="font-serif text-[2.25rem] font-semibold text-ledger-900 tabular-nums">
          {formatMoney(totalBalanceMinor, "TND")}{" "}
          <span className="font-sans text-[1rem] font-normal text-ledger-500">DT</span>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-paper-0 border border-line rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-md bg-paper-100">
                  {getAccountIcon(acc.type)}
                </div>
                <span className="text-[0.75rem] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-ledger-100 text-ledger-700">
                  {acc.type}
                </span>
              </div>
              <h2 className="font-sans font-semibold text-[1.0625rem] text-ledger-900">
                {acc.name}
              </h2>
              <p className="font-sans text-[0.8125rem] text-ledger-500 mt-0.5">
                Opening: {formatMoney(acc.openingBalanceMinor, "TND")} DT
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-line flex justify-between items-baseline">
              <span className="font-sans text-[0.8125rem] text-ledger-700">Live balance</span>
              <span className="font-serif font-semibold text-[1.25rem] text-ledger-900 tabular-nums">
                {formatMoney(acc.balanceMinor, "TND")} DT
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
