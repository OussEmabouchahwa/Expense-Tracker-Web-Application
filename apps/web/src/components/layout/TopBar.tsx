import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button.js";

export interface TopBarProps {
  onAddTransaction: () => void;
  userName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onAddTransaction,
  userName = "Amira Ben Salah",
}) => {
  const location = useLocation();

  const navItems = [
    { label: "Overview", href: "/" },
    { label: "Transactions", href: "/transactions" },
    { label: "Budgets", href: "/budgets" },
    { label: "Reports", href: "/reports" },
    { label: "Accounts", href: "/accounts" },
  ];

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center gap-7 h-[60px] px-4 md:px-10 bg-ledger-100 border-b border-line">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 font-serif font-semibold text-[1.4375rem] text-ledger-900 no-underline">
        <svg viewBox="0 0 20 24" className="w-5 h-6" aria-hidden="true">
          <path
            d="M1 1h18v22l-3-2.5-3 2.5-3-2.5-3 2.5-3-2.5L1 23z"
            fill="var(--stamp-500)"
          />
        </svg>
        <span>Masrouf</span>
      </Link>

      {/* Nav */}
      <nav aria-label="Main" className="hidden sm:flex gap-1 h-full">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center px-3 font-sans text-[0.9375rem] font-medium transition-colors no-underline border-b-2 mb-[-1px] ${
                isActive
                  ? "text-ledger-900 border-b-ledger-900 font-semibold"
                  : "text-ledger-700 border-b-transparent hover:text-ledger-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Global Add Transaction Button */}
      <Button
        variant="primary"
        onClick={onAddTransaction}
        className="gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Add <span className="hidden md:inline">transaction</span></span>
      </Button>

      {/* User Avatar */}
      <span
        className="w-[34px] h-[34px] rounded-full bg-paper-0 border border-line grid place-items-center font-sans font-semibold text-[0.8125rem] text-ledger-900 select-none"
        aria-label={`Signed in as ${userName}`}
        title={`Signed in as ${userName}`}
      >
        {initials}
      </span>
    </header>
  );
};
