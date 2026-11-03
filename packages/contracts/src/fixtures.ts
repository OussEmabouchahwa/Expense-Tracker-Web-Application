import { AccountType, CategoryKind, TransactionKind } from "./enums.js";

export const FIXTURE_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "demo@masrouf.test",
  name: "Amira Ben Salah",
  currency: "TND",
  locale: "fr-TN",
  timezone: "Africa/Tunis",
};

export const FIXTURE_ACCOUNTS = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Courant BIAT",
    type: AccountType.BANK,
    openingBalanceMinor: 1200000, // 1,200.000 DT
    balanceMinor: 2450300, // 2,450.300 DT
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Espèces (Portefeuille)",
    type: AccountType.CASH,
    openingBalanceMinor: 150000, // 150.000 DT
    balanceMinor: 85200, // 85.200 DT
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    name: "Carte Technologique",
    type: AccountType.CARD,
    openingBalanceMinor: 500000, // 500.000 DT
    balanceMinor: 310500, // 310.500 DT
  },
];

export const FIXTURE_CATEGORIES = [
  { id: "c0000000-0000-0000-0000-000000000001", name: "Alimentation & Courses", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000002", name: "Loyer & Charges", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000003", name: "Transport & Carburant", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000004", name: "Cafés & Sorties", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000005", name: "Factures & Internet", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000006", name: "Santé & Pharmacie", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000007", name: "Loisirs & Culture", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000008", name: "Abonnements en ligne", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000009", name: "Vêtements & Soins", kind: CategoryKind.EXPENSE },
  { id: "c0000000-0000-0000-0000-000000000010", name: "Salaire", kind: CategoryKind.INCOME },
  { id: "c0000000-0000-0000-0000-000000000011", name: "Missions Freelance", kind: CategoryKind.INCOME },
  { id: "c0000000-0000-0000-0000-000000000012", name: "Remboursements", kind: CategoryKind.INCOME },
];

export const FIXTURE_TRANSACTIONS = [
  {
    id: "t0000000-0000-0000-0000-000000000001",
    occurredOn: "2026-10-28",
    payee: "Carrefour Market",
    note: "Courses de la semaine",
    amountMinor: 114350,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[0]!.id,
    accountName: "Courant BIAT",
    categoryName: "Alimentation & Courses",
  },
  {
    id: "t0000000-0000-0000-0000-000000000002",
    occurredOn: "2026-10-27",
    payee: "Café des Négociants",
    note: null,
    amountMinor: 8200,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[1]!.id,
    categoryId: FIXTURE_CATEGORIES[3]!.id,
    accountName: "Espèces (Portefeuille)",
    categoryName: "Cafés & Sorties",
  },
  {
    id: "t0000000-0000-0000-0000-000000000003",
    occurredOn: "2026-10-25",
    payee: "Client Tech SARL",
    note: "Facture N° 2026-10",
    amountMinor: 850000,
    kind: TransactionKind.INCOME,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[10]!.id,
    accountName: "Courant BIAT",
    categoryName: "Missions Freelance",
  },
  {
    id: "t0000000-0000-0000-0000-000000000004",
    occurredOn: "2026-10-24",
    payee: "Kiosque Agil",
    note: "Plein sans plomb",
    amountMinor: 75000,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[2]!.id,
    accountName: "Courant BIAT",
    categoryName: "Transport & Carburant",
  },
  {
    id: "t0000000-0000-0000-0000-000000000005",
    occurredOn: "2026-10-20",
    payee: "Pharmacie El Manar",
    note: "Médicaments",
    amountMinor: 42300,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[1]!.id,
    categoryId: FIXTURE_CATEGORIES[5]!.id,
    accountName: "Espèces (Portefeuille)",
    categoryName: "Santé & Pharmacie",
  },
  {
    id: "t0000000-0000-0000-0000-000000000006",
    occurredOn: "2026-10-15",
    payee: "Topnet ADSL",
    note: "Abonnement trimestriel",
    amountMinor: 68000,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[4]!.id,
    accountName: "Courant BIAT",
    categoryName: "Factures & Internet",
  },
  {
    id: "t0000000-0000-0000-0000-000000000007",
    occurredOn: "2026-10-01",
    payee: "Virement Salaire Société",
    note: "Salaire Octobre 2026",
    amountMinor: 3200000,
    kind: TransactionKind.INCOME,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[9]!.id,
    accountName: "Courant BIAT",
    categoryName: "Salaire",
  },
  {
    id: "t0000000-0000-0000-0000-000000000008",
    occurredOn: "2026-10-01",
    payee: "Propriétaire Appartement",
    note: "Loyer Octobre",
    amountMinor: 850000,
    kind: TransactionKind.EXPENSE,
    accountId: FIXTURE_ACCOUNTS[0]!.id,
    categoryId: FIXTURE_CATEGORIES[1]!.id,
    accountName: "Courant BIAT",
    categoryName: "Loyer & Charges",
  },
];

export const FIXTURE_SUMMARY = {
  current: {
    incomeMinor: 4050000, // 4,050.000 DT
    expenseMinor: 2146300, // 2,146.300 DT
    netMinor: 1903700, // 1,903.700 DT
    savingsRate: 47, // 47%
    transactionCount: 38,
  },
  previous: {
    incomeMinor: 3800000,
    expenseMinor: 1986950,
    netMinor: 1813050,
    savingsRate: 48,
    transactionCount: 34,
  },
  dayOfMonth: 28,
  daysInMonth: 31,
  paceDifferenceMinor: 159350, // +159.350 DT
  paceDifferencePercent: 8, // 8% more
};

export const FIXTURE_BUDGETS = [
  {
    categoryId: FIXTURE_CATEGORIES[0]!.id,
    categoryName: "Alimentation & Courses",
    limitMinor: 750000, // 750 DT
    spentMinor: 610000, // 610 DT (81% at day 28: 28/31 = 90% -> ON_PACE)
    status: "ON_PACE" as const,
    leftMinor: 140000,
  },
  {
    categoryId: FIXTURE_CATEGORIES[1]!.id,
    categoryName: "Loyer & Charges",
    limitMinor: 850000, // 850 DT
    spentMinor: 850000, // 850 DT
    status: "ON_PACE" as const,
    leftMinor: 0,
  },
  {
    categoryId: FIXTURE_CATEGORIES[2]!.id,
    categoryName: "Transport & Carburant",
    limitMinor: 220000, // 220 DT
    spentMinor: 245000, // 245 DT -> OVER by 25.000 DT
    status: "OVER" as const,
    leftMinor: 0,
    overByMinor: 25000,
  },
  {
    categoryId: FIXTURE_CATEGORIES[3]!.id,
    categoryName: "Cafés & Sorties",
    limitMinor: 180000, // 180 DT
    spentMinor: 172000, // 172 DT (95% spent while expected is 90% -> AHEAD)
    status: "AHEAD" as const,
    leftMinor: 8000,
  },
];

export const FIXTURE_SPENDING_PACE = {
  month: "2026-10",
  previousMonth: "2026-09",
  dayOfMonth: 28,
  daysInMonth: 31,
  daysInPreviousMonth: 30,
  thisMonthSpendByDay: [
    { day: 1, amountMinor: 850000, cumulativeMinor: 850000 },
    { day: 2, amountMinor: 15000, cumulativeMinor: 865000 },
    { day: 5, amountMinor: 48000, cumulativeMinor: 913000 },
    { day: 10, amountMinor: 120000, cumulativeMinor: 1033000 },
    { day: 15, amountMinor: 210000, cumulativeMinor: 1243000 },
    { day: 20, amountMinor: 350000, cumulativeMinor: 1593000 },
    { day: 25, amountMinor: 390000, cumulativeMinor: 1983000 },
    { day: 28, amountMinor: 163300, cumulativeMinor: 2146300 },
  ],
  lastMonthSpendByDay: [
    { day: 1, amountMinor: 850000, cumulativeMinor: 850000 },
    { day: 5, amountMinor: 60000, cumulativeMinor: 910000 },
    { day: 10, amountMinor: 180000, cumulativeMinor: 1090000 },
    { day: 15, amountMinor: 170000, cumulativeMinor: 1260000 },
    { day: 20, amountMinor: 310000, cumulativeMinor: 1570000 },
    { day: 25, amountMinor: 260000, cumulativeMinor: 1830000 },
    { day: 28, amountMinor: 156950, cumulativeMinor: 1986950 },
    { day: 30, amountMinor: 120000, cumulativeMinor: 2106950 },
  ],
  currentTotalMinor: 2146300,
  previousAtSameDayMinor: 1986950,
  findingSentence:
    "By day 28 you have spent 159.350 DT more than by the same day in September, 8% more.",
};
