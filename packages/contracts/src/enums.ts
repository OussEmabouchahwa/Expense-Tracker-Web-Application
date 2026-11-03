export const AccountType = {
  CASH: "CASH",
  BANK: "BANK",
  CARD: "CARD",
  SAVINGS: "SAVINGS",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const CategoryKind = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
} as const;

export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];

export const TransactionKind = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
} as const;

export type TransactionKind = (typeof TransactionKind)[keyof typeof TransactionKind];
