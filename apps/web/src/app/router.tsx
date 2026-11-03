import React from "react";
import { createBrowserRouter, useOutletContext } from "react-router-dom";
import { AppShell } from "./AppShell.js";
import { OverviewPage } from "../features/overview/OverviewPage.js";
import { TransactionsPage } from "../features/transactions/TransactionsPage.js";
import { BudgetsPage } from "../features/budgets/BudgetsPage.js";
import { ReportsPage } from "../features/reports/ReportsPage.js";
import { AccountsPage } from "../features/accounts/AccountsPage.js";
import { KitPage } from "../features/kit/KitPage.js";
import { TransactionFormData } from "../features/transactions/TransactionDrawer.js";

interface OutletContextType {
  onEditTransaction: (tx: TransactionFormData) => void;
}

const OverviewRoute: React.FC = () => {
  const { onEditTransaction } = useOutletContext<OutletContextType>();
  return <OverviewPage onEditTransaction={onEditTransaction} />;
};

const TransactionsRoute: React.FC = () => {
  const { onEditTransaction } = useOutletContext<OutletContextType>();
  return <TransactionsPage onEditTransaction={onEditTransaction} />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewRoute /> },
      { path: "transactions", element: <TransactionsRoute /> },
      { path: "budgets", element: <BudgetsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "accounts", element: <AccountsPage /> },
      { path: "__kit", element: <KitPage /> },
    ],
  },
]);
