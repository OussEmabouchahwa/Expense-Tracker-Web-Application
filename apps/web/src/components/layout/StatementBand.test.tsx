import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatementBand } from "./StatementBand.js";

describe("StatementBand", () => {
  it("renders income with + sign, expense with true minus, and correct savings rate", () => {
    render(
      <StatementBand
        incomeMinor={4050000}
        expenseMinor={2146300}
        netMinor={1903700}
        savingsRate={47}
        currency="TND"
      />
    );

    // Income
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText(/\+4.*050/)).toBeInTheDocument();

    // Expenses
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText(/−2.*146/)).toBeInTheDocument();

    // Net
    expect(screen.getByText("Net")).toBeInTheDocument();
    expect(screen.getByText(/\+1.*903/)).toBeInTheDocument();

    // Savings rate
    expect(screen.getByText("Savings rate")).toBeInTheDocument();
    expect(screen.getByText("47%")).toBeInTheDocument();
  });
});
