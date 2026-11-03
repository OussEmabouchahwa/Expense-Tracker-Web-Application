/**
 * Checks if a string is a valid ISO calendar date format YYYY-MM-DD
 * and corresponds to an actual calendar date (e.g. rejects 2026-02-30).
 */
export function isValidCalendarDate(dateStr: string): boolean {
  if (typeof dateStr !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  // Check days in specific month considering leap years
  const maxDays = getDaysInMonthForYear(year, month);
  return day <= maxDays;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonthForYear(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Returns today's date in YYYY-MM-DD for a specific IANA timezone (default Africa/Tunis).
 * Allows injecting `now` for reproducible unit tests.
 */
export function todayInZone(timezone: string = "Africa/Tunis", now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Extracts day of month as an integer from YYYY-MM-DD string.
 */
export function dayOfMonth(dateStr: string): number {
  if (!isValidCalendarDate(dateStr)) {
    throw new Error(`Invalid calendar date: ${dateStr}`);
  }
  return Number(dateStr.slice(8, 10));
}

/**
 * Returns total days in a month string YYYY-MM.
 */
export function daysInMonth(monthStr: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  if (!match) {
    throw new Error(`Invalid month format (expected YYYY-MM): ${monthStr}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month value: ${month}`);
  }
  return getDaysInMonthForYear(year, month);
}

export interface MonthRange {
  start: string; // YYYY-MM-01 inclusive
  nextStart: string; // First day of next month (half-open upper bound < nextStart)
  days: number;
}

/**
 * Computes half-open date interval for a given month (YYYY-MM).
 * Range is >= start AND < nextStart
 */
export function monthRange(monthStr: string): MonthRange {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  if (!match) {
    throw new Error(`Invalid month format (expected YYYY-MM): ${monthStr}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month value: ${month}`);
  }

  const days = getDaysInMonthForYear(year, month);
  const start = `${year}-${String(month).padStart(2, "0")}-01`;

  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextYear += 1;
    nextMonth = 1;
  }
  const nextStart = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return { start, nextStart, days };
}

/**
 * Returns previous month in YYYY-MM format.
 */
export function getPreviousMonth(monthStr: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  if (!match) {
    throw new Error(`Invalid month format: ${monthStr}`);
  }
  let year = Number(match[1]);
  let month = Number(match[2]) - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * Formats a month string YYYY-MM into localized human display (e.g. "October 2026").
 */
export function formatMonthName(
  monthStr: string,
  locale: string = "en-US"
): string {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  if (!match) return monthStr;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
