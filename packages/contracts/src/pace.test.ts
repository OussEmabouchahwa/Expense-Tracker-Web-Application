import { describe, it, expect } from "vitest";
import {
  expectedFraction,
  calculateBudgetStatus,
  calculateLeftToSpend,
  calculateSavingsRate,
} from "./pace.js";

describe("expectedFraction", () => {
  it("returns 1 for past months", () => {
    expect(expectedFraction("2026-09", "2026-10-28")).toBe(1);
  });

  it("returns 0 for future months", () => {
    expect(expectedFraction("2026-11", "2026-10-28")).toBe(0);
  });

  it("calculates fraction for current month", () => {
    // 28 / 31
    const frac = expectedFraction("2026-10", "2026-10-28");
    expect(frac).toBeCloseTo(28 / 31, 5);
  });
});

describe("calculateBudgetStatus", () => {
  it("marks OVER when spent exceeds limit", () => {
    // limit 100, spent 101, fraction 0.5
    expect(calculateBudgetStatus(101000, 100000, 0.5)).toBe("OVER");
  });

  it("marks UPCOMING when fraction is 0", () => {
    expect(calculateBudgetStatus(0, 100000, 0)).toBe("UPCOMING");
  });

  it("marks AHEAD when spent/limit > expectedFraction", () => {
    // limit 100, spent 60 (fraction 0.6), expectedFraction 0.5 -> AHEAD
    expect(calculateBudgetStatus(60000, 100000, 0.5)).toBe("AHEAD");
  });

  it("marks ON_PACE when spent/limit <= expectedFraction", () => {
    // limit 100, spent 40 (fraction 0.4), expectedFraction 0.5 -> ON_PACE
    expect(calculateBudgetStatus(40000, 100000, 0.5)).toBe("ON_PACE");
    // exactly on fraction
    expect(calculateBudgetStatus(50000, 100000, 0.5)).toBe("ON_PACE");
  });
});

describe("calculateLeftToSpend", () => {
  it("calculates positive remaining limit", () => {
    expect(calculateLeftToSpend(40000, 100000)).toBe(60000);
  });

  it("returns 0 when spent exceeds limit", () => {
    expect(calculateLeftToSpend(120000, 100000)).toBe(0);
  });
});

describe("calculateSavingsRate", () => {
  it("calculates integer percentage rate", () => {
    // Net: 1903.700, Income: 4050.000 -> 47%
    expect(calculateSavingsRate(1903700, 4050000)).toBe(47);
  });

  it("returns 0 when income is 0 or negative", () => {
    expect(calculateSavingsRate(50000, 0)).toBe(0);
    expect(calculateSavingsRate(-50000, -100000)).toBe(0);
  });
});
