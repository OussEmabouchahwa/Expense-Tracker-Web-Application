import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AmountInput } from "./AmountInput.js";

const AmountInputWrapper: React.FC<{ initialMinor?: number; onValueChange?: (val: number) => void }> = ({
  initialMinor = 0,
  onValueChange,
}) => {
  const [val, setVal] = useState(initialMinor);
  return (
    <AmountInput
      valueMinor={val}
      onChange={(newVal) => {
        setVal(newVal);
        onValueChange?.(newVal);
      }}
      currency="TND"
    />
  );
};

describe("AmountInput", () => {
  it("displays formatted amount on blur and parses decimal string into minor units", () => {
    const handleChange = vi.fn();
    render(<AmountInputWrapper initialMinor={0} onValueChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12.500" } });
    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledWith(12500);
  });
});
