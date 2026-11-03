import {
  formatMoney as contractsFormatMoney,
  formatSignedMoney as contractsFormatSignedMoney,
  parseMoney as contractsParseMoney,
  formatMonthName as contractsFormatMonthName,
} from "@masrouf/contracts";

export function formatMoney(
  minor: number | bigint,
  currency: string = "TND",
  locale: string = "fr-TN"
): string {
  return contractsFormatMoney(minor, currency, locale);
}

export function formatSignedMoney(
  minor: number | bigint,
  currency: string = "TND",
  locale: string = "fr-TN"
) {
  return contractsFormatSignedMoney(minor, currency, locale);
}

export function parseMoney(text: string, currency: string = "TND"): number {
  return contractsParseMoney(text, currency);
}

export function formatMonthName(monthStr: string, locale: string = "en-US"): string {
  return contractsFormatMonthName(monthStr, locale);
}
