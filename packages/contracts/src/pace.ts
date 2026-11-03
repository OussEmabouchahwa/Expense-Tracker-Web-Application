import { dayOfMonth, daysInMonth } from "./dates.js";

export type BudgetStatus = "ON_PACE" | "AHEAD" | "OVER" | "UPCOMING";

/**
 * Calculates expected spend fraction for a given month relative to "today":
 * - Past months: 1.0 (expected to be complete)
 * - Future months: 0.0 (upcoming)
 * - Current month: dayOfMonth / daysInMonth
 */
export function expectedFraction(monthStr: string, todayStr: string): number {
  const currentMonthStr = todayStr.slice(0, 7);

  if (monthStr < currentMonthStr) {
    return 1;
  }
  if (monthStr > currentMonthStr) {
    return 0;
  }

  const currentDay = dayOfMonth(todayStr);
  const totalDays = daysInMonth(monthStr);

  return Math.min(1, Math.max(0, currentDay / totalDays));
}

/**
 * Determines budget pace status based on spent minor amount, limit, and expected pace fraction.
 */
export function calculateBudgetStatus(
  spentMinor: number,
  limitMinor: number,
  fraction: number
): BudgetStatus {
  if (limitMinor <= 0) {
    throw new Error("Budget limit must be greater than zero");
  }

  if (spentMinor > limitMinor) {
    return "OVER";
  }

  if (fraction === 0) {
    return "UPCOMING";
  }

  const actualFraction = spentMinor / limitMinor;

  // If spending exceeds the expected fraction for today, user is AHEAD of pace (warning)
  if (actualFraction > fraction) {
    return "AHEAD";
  }

  return "ON_PACE";
}

/**
 * Calculates remaining funds for a budget limit.
 */
export function calculateLeftToSpend(spentMinor: number, limitMinor: number): number {
  return Math.max(0, limitMinor - spentMinor);
}

/**
 * Computes savings rate as a percentage integer (e.g. 24 for 24%).
 * Defined as net / income. Returns 0 if income <= 0.
 */
export function calculateSavingsRate(netMinor: number, incomeMinor: number): number {
  if (incomeMinor <= 0) {
    return 0;
  }
  const rate = (netMinor / incomeMinor) * 100;
  return Math.round(rate);
}
