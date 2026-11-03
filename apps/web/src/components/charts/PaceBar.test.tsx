import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PaceBar } from "./PaceBar.js";

describe("PaceBar", () => {
  it("renders on pace status with correct labels", () => {
    render(
      <PaceBar
        categoryName="Courses & Alimentation"
        spentMinor={610000}
        limitMinor={750000}
        expectedFraction={0.9}
        status="ON_PACE"
        currency="TND"
        dayOfMonth={28}
        daysInMonth={31}
      />
    );

    expect(screen.getByText("Courses & Alimentation")).toBeInTheDocument();
    expect(screen.getByText("On pace")).toBeInTheDocument();
    expect(screen.getByText(/Day 28 of 31/)).toBeInTheDocument();
  });

  it("renders over budget status tag with over amount", () => {
    render(
      <PaceBar
        categoryName="Transport & Carburant"
        spentMinor={245000}
        limitMinor={220000}
        expectedFraction={0.9}
        status="OVER"
        overByMinor={25000}
        currency="TND"
      />
    );

    expect(screen.getByText(/Over by 25/)).toBeInTheDocument();
  });
});
