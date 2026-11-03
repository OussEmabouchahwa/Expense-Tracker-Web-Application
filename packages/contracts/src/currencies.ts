export const CURRENCIES = {
  TND: { code: "TND", exponent: 3, symbol: "DT", name: "Tunisian Dinar" },
  EUR: { code: "EUR", exponent: 2, symbol: "€", name: "Euro" },
  USD: { code: "USD", exponent: 2, symbol: "$", name: "US Dollar" },
} as const;

export type SupportedCurrency = keyof typeof CURRENCIES;

export function getCurrencyExponent(currency: string): number {
  const curr = CURRENCIES[currency as SupportedCurrency];
  if (!curr) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return curr.exponent;
}
