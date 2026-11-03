import { getCurrencyExponent, SupportedCurrency } from "./currencies.js";

/**
 * Parses monetary user input string into integer minor units using pure string operations.
 * Never uses floating-point arithmetic.
 *
 * @param text - User input string like "12.500", "12,5", "42"
 * @param currency - Currency code (e.g. "TND", "EUR", "USD")
 * @returns minor units as an integer number
 * @throws Error if text is invalid, contains scientific notation, or exceeds decimal precision
 */
export function parseMoney(text: string, currency: SupportedCurrency | string): number {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  const trimmed = text.trim();
  if (trimmed === "") {
    throw new Error("Amount cannot be empty");
  }

  if (/[eE]/.test(trimmed)) {
    throw new Error("Scientific notation is not allowed");
  }

  // Normalize decimal separator (comma to dot)
  const normalized = trimmed.replace(",", ".");

  // Reject invalid characters or multiple dots or negative sign
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid money format: "${text}"`);
  }

  const exponent = getCurrencyExponent(currency);
  const parts = normalized.split(".");
  const integerPart = parts[0] || "0";
  const fractionalPart = parts[1] || "";

  if (fractionalPart.length > exponent) {
    throw new Error(
      `Fractional part exceeds maximum allowed precision of ${exponent} for ${currency}`
    );
  }

  // Pad the fractional part to the required exponent
  const paddedFractional = fractionalPart.padEnd(exponent, "0");

  // Combine parts into minor string
  const combined = `${integerPart}${paddedFractional}`.replace(/^0+/, "");
  const minorStr = combined === "" ? "0" : combined;

  const result = Number(minorStr);
  if (!Number.isSafeInteger(result)) {
    throw new Error("Amount exceeds maximum safe integer");
  }

  return result;
}

/**
 * Formats integer minor units into a localized currency string with fixed decimals.
 *
 * @param minor - Amount in minor units (integer)
 * @param currency - Currency code
 * @param locale - BCP 47 locale string (default 'fr-TN' for TND, 'en-US' otherwise)
 */
export function formatMoney(
  minor: number | bigint,
  currency: SupportedCurrency | string,
  locale?: string
): string {
  const exponent = getCurrencyExponent(currency);
  const numericMinor = typeof minor === "bigint" ? Number(minor) : minor;

  if (!Number.isFinite(numericMinor)) {
    throw new Error("Amount must be a finite number");
  }

  const absMinor = Math.abs(numericMinor);
  const majorValue = absMinor / Math.pow(10, exponent);

  const targetLocale = locale ?? (currency === "TND" ? "fr-TN" : "en-US");

  const formatted = new Intl.NumberFormat(targetLocale, {
    minimumFractionDigits: exponent,
    maximumFractionDigits: exponent,
    useGrouping: true,
  }).format(majorValue);

  return numericMinor < 0 ? `−${formatted}` : formatted;
}

export interface FormattedSignedMoney {
  formatted: string;
  sign: "+" | "−" | "";
  fullFormatted: string;
}

/**
 * Formats integer minor units with explicit sign (+, true minus −, or empty for 0)
 * Uses U+2212 for the true minus.
 */
export function formatSignedMoney(
  minor: number | bigint,
  currency: SupportedCurrency | string,
  locale?: string
): FormattedSignedMoney {
  const numericMinor = typeof minor === "bigint" ? Number(minor) : minor;
  const baseFormatted = formatMoney(Math.abs(numericMinor), currency, locale);

  if (numericMinor > 0) {
    return {
      formatted: baseFormatted,
      sign: "+",
      fullFormatted: `+${baseFormatted}`,
    };
  }

  if (numericMinor < 0) {
    return {
      formatted: baseFormatted,
      sign: "−",
      fullFormatted: `−${baseFormatted}`,
    };
  }

  return {
    formatted: baseFormatted,
    sign: "",
    fullFormatted: baseFormatted,
  };
}
