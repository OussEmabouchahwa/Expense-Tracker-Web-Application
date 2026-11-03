import React, { useId } from "react";
import { cn } from "../../lib/cn.js";

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  hint,
  required,
  className,
  children,
}) => {
  const generatedId = useId();
  const hintId = `${generatedId}-hint`;
  const errorId = `${generatedId}-error`;

  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={generatedId}
        className="font-sans text-[0.875rem] font-semibold text-ledger-900 flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-loss-600 ml-1" aria-hidden="true">*</span>}
        </span>
      </label>

      {children({
        id: generatedId,
        "aria-describedby": describedBy,
        "aria-invalid": Boolean(error),
      })}

      {error ? (
        <p id={errorId} className="font-sans text-[0.8125rem] text-loss-600 font-medium">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="font-sans text-[0.8125rem] text-ledger-700">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
