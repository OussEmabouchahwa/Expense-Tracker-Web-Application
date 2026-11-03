import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar.js";
import {
  TransactionDrawer,
  TransactionFormData,
} from "../features/transactions/TransactionDrawer.js";
import { ToastProvider, useToast } from "../components/ui/Toast.js";
import { FIXTURE_USER } from "@masrouf/contracts";

export const AppShellContent: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionFormData | null>(null);

  // Keyboard shortcuts handler
  useEffect(() => {
    let pendingG = false;
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setEditingTx(null);
        setDrawerOpen(true);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate("/transactions");
      } else if (e.key === "g") {
        pendingG = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          pendingG = false;
        }, 1000);
      } else if (pendingG) {
        pendingG = false;
        if (e.key === "o") navigate("/");
        if (e.key === "t") navigate("/transactions");
        if (e.key === "b") navigate("/budgets");
        if (e.key === "r") navigate("/reports");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleSaveTransaction = (
    txData: TransactionFormData,
    addAnother?: boolean
  ) => {
    showToast(
      `${txData.id ? "Updated" : "Saved"} ${txData.payee}.`,
      "Undo",
      () => {
        showToast("Restored previous transaction state.");
      }
    );
    if (!addAnother) {
      setDrawerOpen(false);
      setEditingTx(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingTx(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (tx: TransactionFormData) => {
    setEditingTx(tx);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col font-sans text-ledger-900">
      <TopBar onAddTransaction={handleOpenAdd} userName={FIXTURE_USER.name} />

      <div className="flex-1">
        <Outlet context={{ onEditTransaction: handleOpenEdit }} />
      </div>

      <TransactionDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialData={editingTx}
        onSave={handleSaveTransaction}
        currency={FIXTURE_USER.currency}
      />
    </div>
  );
};

export const AppShell: React.FC = () => {
  return (
    <ToastProvider>
      <AppShellContent />
    </ToastProvider>
  );
};
