import React, { useState, useEffect } from "react";
import { Drawer } from "../../components/ui/Drawer.js";
import { Button } from "../../components/ui/Button.js";
import { Field } from "../../components/ui/Field.js";
import { Input } from "../../components/ui/Input.js";
import { Select } from "../../components/ui/Select.js";
import { AmountInput } from "../../components/ui/AmountInput.js";
import { Segmented } from "../../components/ui/Segmented.js";
import {
  FIXTURE_ACCOUNTS,
  FIXTURE_CATEGORIES,
} from "@masrouf/contracts";

export interface TransactionFormData {
  id?: string;
  kind: "EXPENSE" | "INCOME";
  amountMinor: number;
  payee: string;
  categoryId: string;
  accountId: string;
  occurredOn: string;
  note?: string;
}

export interface TransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TransactionFormData | null;
  onSave: (data: TransactionFormData, saveAndAddAnother?: boolean) => void;
  onDelete?: (id: string) => void;
  currency?: string;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  onDelete,
  currency = "TND",
}) => {
  const [kind, setKind] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amountMinor, setAmountMinor] = useState<number>(0);
  const [payee, setPayee] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [occurredOn, setOccurredOn] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = FIXTURE_CATEGORIES.filter((c) => c.kind === kind);
  const accounts = FIXTURE_ACCOUNTS;

  useEffect(() => {
    if (initialData) {
      setKind(initialData.kind);
      setAmountMinor(initialData.amountMinor);
      setPayee(initialData.payee);
      setCategoryId(initialData.categoryId);
      setAccountId(initialData.accountId);
      setOccurredOn(initialData.occurredOn);
      setNote(initialData.note ?? "");
    } else {
      setKind("EXPENSE");
      setAmountMinor(0);
      setPayee("");
      setCategoryId(categories[0]?.id ?? "");
      setAccountId(accounts[0]?.id ?? "");
      setOccurredOn(new Date().toISOString().slice(0, 10));
      setNote("");
    }
    setErrors({});
  }, [initialData, open]);

  // Adjust category if kind changed and current category is not valid for kind
  useEffect(() => {
    const valid = categories.some((c) => c.id === categoryId);
    if (!valid && categories.length > 0) {
      setCategoryId(categories[0]!.id);
    }
  }, [kind]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (amountMinor <= 0) {
      nextErrors.amountMinor = "Enter an amount greater than zero.";
    }
    if (!payee.trim()) {
      nextErrors.payee = "Enter a payee or description.";
    }
    if (!categoryId) {
      nextErrors.categoryId = "Select a category.";
    }
    if (!accountId) {
      nextErrors.accountId = "Select an account.";
    }
    if (!occurredOn) {
      nextErrors.occurredOn = "Enter a valid calendar date.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (addAnother = false) => {
    if (!validate()) return;
    onSave(
      {
        id: initialData?.id,
        kind,
        amountMinor,
        payee: payee.trim(),
        categoryId,
        accountId,
        occurredOn,
        note: note.trim() || undefined,
      },
      addAnother
    );

    if (addAnother) {
      setAmountMinor(0);
      setPayee("");
      setNote("");
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit transaction" : "Add transaction"}
      description={
        initialData
          ? "Update the details of this transaction."
          : "Record an expense or income entry."
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(false);
        }}
        className="flex flex-col gap-4 flex-1 justify-between"
      >
        <div className="flex flex-col gap-4">
          {/* Segmented Kind Toggle */}
          <Segmented
            value={kind}
            onChange={(val) => setKind(val)}
            options={[
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
            ]}
            className="w-full justify-center"
          />

          {/* Amount input */}
          <Field label="Amount" error={errors.amountMinor} required>
            {({ id, "aria-describedby": describedby, "aria-invalid": invalid }) => (
              <AmountInput
                id={id}
                valueMinor={amountMinor}
                onChange={setAmountMinor}
                currency={currency}
                hasError={Boolean(errors.amountMinor)}
                aria-describedby={describedby}
                aria-invalid={invalid}
                autoFocus
              />
            )}
          </Field>

          {/* Payee */}
          <Field label="Payee / Description" error={errors.payee} required>
            {({ id, "aria-describedby": describedby, "aria-invalid": invalid }) => (
              <Input
                id={id}
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder="e.g. Carrefour, Monoprix, Client Tech"
                hasError={Boolean(errors.payee)}
                aria-describedby={describedby}
                aria-invalid={invalid}
              />
            )}
          </Field>

          {/* Category */}
          <Field label="Category" error={errors.categoryId} required>
            {({ id, "aria-describedby": describedby, "aria-invalid": invalid }) => (
              <Select
                id={id}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                hasError={Boolean(errors.categoryId)}
                aria-describedby={describedby}
                aria-invalid={invalid}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {/* Account */}
          <Field label="Account" error={errors.accountId} required>
            {({ id, "aria-describedby": describedby, "aria-invalid": invalid }) => (
              <Select
                id={id}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                hasError={Boolean(errors.accountId)}
                aria-describedby={describedby}
                aria-invalid={invalid}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {/* Date */}
          <Field label="Date" error={errors.occurredOn} required>
            {({ id, "aria-describedby": describedby, "aria-invalid": invalid }) => (
              <Input
                id={id}
                type="date"
                value={occurredOn}
                onChange={(e) => setOccurredOn(e.target.value)}
                hasError={Boolean(errors.occurredOn)}
                aria-describedby={describedby}
                aria-invalid={invalid}
              />
            )}
          </Field>

          {/* Note */}
          <Field label="Note" hint="Optional memo for your records">
            {({ id, "aria-describedby": describedby }) => (
              <Input
                id={id}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Courses de la semaine"
                aria-describedby={describedby}
              />
            )}
          </Field>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-line flex flex-col gap-2">
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="flex-1">
              Save transaction
            </Button>
            {!initialData && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSave(true)}
              >
                Save & add another
              </Button>
            )}
          </div>
          {initialData?.id && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (initialData.id) onDelete(initialData.id);
                onOpenChange(false);
              }}
            >
              Delete transaction
            </Button>
          )}
        </div>
      </form>
    </Drawer>
  );
};
