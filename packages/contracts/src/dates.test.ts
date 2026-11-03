import { describe, it, expect } from "vitest";
import {
  isValidCalendarDate,
  isLeapYear,
  getDaysInMonthForYear,
  todayInZone,
  dayOfMonth,
  daysInMonth,
  monthRange,
  getPreviousMonth,
} from "./dates.js";

describe("isValidCalendarDate", () => {
  it("accepts valid calendar dates", () => {
    expect(isValidCalendarDate("2026-10-28")).toBe(true);
    expect(isValidCalendarDate("2024-02-29")).toBe(true); // leap year
    expect(isValidCalendarDate("2026-12-31")).toBe(true);
  });

  it("rejects non-existent calendar dates", () => {
    expect(isValidCalendarDate("2026-02-29")).toBe(false); // not a leap year
    expect(isValidCalendarDate("2026-02-30")).toBe(false);
    expect(isValidCalendarDate("2026-04-31")).toBe(false); // April has 30 days
    expect(isValidCalendarDate("2026-13-01")).toBe(false);
    expect(isValidCalendarDate("2026-00-10")).toBe(false);
    expect(isValidCalendarDate("invalid")).toBe(false);
  });
});

describe("isLeapYear and getDaysInMonthForYear", () => {
  it("identifies leap years correctly", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
  });

  it("returns correct days count for February", () => {
    expect(getDaysInMonthForYear(2024, 2)).toBe(29);
    expect(getDaysInMonthForYear(2026, 2)).toBe(28);
  });
});

describe("todayInZone", () => {
  it("respects timezone offset near midnight", () => {
    // 2026-10-31 23:30:00 UTC
    // Africa/Tunis is UTC+1, so it is 2026-11-01 00:30:00
    const fixedNow = new Date(Date.UTC(2026, 9, 31, 23, 30, 0));
    const tunisToday = todayInZone("Africa/Tunis", fixedNow);
    const utcToday = todayInZone("UTC", fixedNow);

    expect(utcToday).toBe("2026-10-31");
    expect(tunisToday).toBe("2026-11-01");
  });
});

describe("dayOfMonth & daysInMonth", () => {
  it("extracts day correctly", () => {
    expect(dayOfMonth("2026-10-28")).toBe(28);
    expect(dayOfMonth("2026-01-05")).toBe(5);
  });

  it("computes days in month", () => {
    expect(daysInMonth("2026-10")).toBe(31);
    expect(daysInMonth("2026-09")).toBe(30);
    expect(daysInMonth("2026-02")).toBe(28);
    expect(daysInMonth("2024-02")).toBe(29);
  });
});

describe("monthRange", () => {
  it("generates half-open intervals", () => {
    const range = monthRange("2026-10");
    expect(range.start).toBe("2026-10-01");
    expect(range.nextStart).toBe("2026-11-01");
    expect(range.days).toBe(31);

    const decRange = monthRange("2026-12");
    expect(decRange.start).toBe("2026-12-01");
    expect(decRange.nextStart).toBe("2027-01-01");
    expect(decRange.days).toBe(31);
  });
});

describe("getPreviousMonth", () => {
  it("computes previous month", () => {
    expect(getPreviousMonth("2026-10")).toBe("2026-09");
    expect(getPreviousMonth("2026-01")).toBe("2025-12");
  });
});
