import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SpendingPaceChart } from "./SpendingPaceChart.js";
import { FIXTURE_SPENDING_PACE } from "@masrouf/contracts";

describe("SpendingPaceChart", () => {
  it("renders finding sentence as accessible image label and text", () => {
    const pace = FIXTURE_SPENDING_PACE;
    render(
      <SpendingPaceChart
        thisMonthSpend={pace.thisMonthSpendByDay}
        lastMonthSpend={pace.lastMonthSpendByDay}
        todayDay={pace.dayOfMonth}
        daysInMonth={pace.daysInMonth}
        daysInLastMonth={pace.daysInPreviousMonth}
        findingSentence={pace.findingSentence}
        currency="TND"
      />
    );

    expect(screen.getByText(pace.findingSentence)).toBeInTheDocument();
    const svg = screen.getByRole("img", { name: pace.findingSentence });
    expect(svg).toBeInTheDocument();
  });

  it("toggles accessible table view when clicked", () => {
    const pace = FIXTURE_SPENDING_PACE;
    render(
      <SpendingPaceChart
        thisMonthSpend={pace.thisMonthSpendByDay}
        lastMonthSpend={pace.lastMonthSpendByDay}
        todayDay={pace.dayOfMonth}
        daysInMonth={pace.daysInMonth}
        daysInLastMonth={pace.daysInPreviousMonth}
        findingSentence={pace.findingSentence}
        currency="TND"
      />
    );

    const toggleBtn = screen.getByRole("button", { name: "View as table" });
    fireEvent.click(toggleBtn);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide table" })).toBeInTheDocument();
  });
});
