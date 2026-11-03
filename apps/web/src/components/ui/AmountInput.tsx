import React, { useState, useEffect } from "react";
import { cn } from "../../lib/cn.js";
import { formatMoney, parseMoney } from "../../lib/format.js";

export interface AmountInputProps {
  valueMinor: number;
  onChange: (valueMinor: number) => void;
  currency?: string;
  hasError?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  autoFocus?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  valueMinor,
  onChange,
  currency = "TND",
  hasError,
  className,
  id,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  autoFocus,
}) => {
  const [text, setText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync incoming value to display text when not typing
  useEffect(() => {
    if (!isFocused) {
      if (valueMinor > 0) {
        setText(formatMoney(valueMinor, currency));
      } else {
        setText("");
      }
    }
  }, [valueMinor, currency, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    if (!text.trim()) {
      onChange(0);
      return;
    }
    try {
      const minor = parseMoney(text, currency);
      onChange(minor);
      setText(formatMoney(minor, currency));
    } catch {
      // Keep user's text on error so they can fix it
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      const minor = parseMoney(val, currency);
      onChange(minor);
    } catch {
      // If incomplete (e.g. "12."), don't emit yet
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-baseline justify-between rounded-md border bg-paper-0 px-4 py-3 transition-colors",
        hasError
          ? "border-loss-600 focus-within:ring-2 focus-within:ring-loss-600"
          : "border-ledger-400 focus-within:ring-2 focus-within:ring-ledger-900",
        className
      )}
    >
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="0.000"
        value={text}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        className="w-full bg-transparent font-serif text-[1.75rem] font-semibold tabular-nums text-ledger-900 placeholder:text-ledger-300 focus:outline-none"
      />
      <span className="ml-2 font-sans text-[1rem] font-semibold text-ledger-500 select-none">
        {currency}
      </span>
    </div>
  );
};
