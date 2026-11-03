import { PrismaClient, AccountType, CategoryKind, TransactionKind } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Seeding development data for Masrouf...");

  // 1. Demo User
  const email = "demo@masrouf.test";
  const passwordHash = await argon2.hash("MasroufDemo-2026");

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name: "Amira Ben Salah",
      currency: "TND",
      locale: "fr-TN",
      timezone: "Africa/Tunis",
    },
    create: {
      email,
      passwordHash,
      name: "Amira Ben Salah",
      currency: "TND",
      locale: "fr-TN",
      timezone: "Africa/Tunis",
    },
  });

  // 2. Accounts
  const accountBiat = await prisma.account.upsert({
    where: { id: "a0000000-0000-0000-0000-000000000001" },
    update: { name: "Courant BIAT", type: AccountType.BANK, openingBalanceMinor: BigInt(1200000) },
    create: {
      id: "a0000000-0000-0000-0000-000000000001",
      userId: user.id,
      name: "Courant BIAT",
      type: AccountType.BANK,
      openingBalanceMinor: BigInt(1200000),
    },
  });

  const accountCash = await prisma.account.upsert({
    where: { id: "a0000000-0000-0000-0000-000000000002" },
    update: { name: "Espèces (Portefeuille)", type: AccountType.CASH, openingBalanceMinor: BigInt(150000) },
    create: {
      id: "a0000000-0000-0000-0000-000000000002",
      userId: user.id,
      name: "Espèces (Portefeuille)",
      type: AccountType.CASH,
      openingBalanceMinor: BigInt(150000),
    },
  });

  const _accountCard = await prisma.account.upsert({
    where: { id: "a0000000-0000-0000-0000-000000000003" },
    update: { name: "Carte Technologique", type: AccountType.CARD, openingBalanceMinor: BigInt(500000) },
    create: {
      id: "a0000000-0000-0000-0000-000000000003",
      userId: user.id,
      name: "Carte Technologique",
      type: AccountType.CARD,
      openingBalanceMinor: BigInt(500000),
    },
  });

  // 3. Categories
  const categoryDefs = [
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

  const categoriesMap: Record<string, string> = {};

  for (const cat of categoryDefs) {
    const created = await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, kind: cat.kind },
      create: { id: cat.id, userId: user.id, name: cat.name, kind: cat.kind },
    });
    categoriesMap[cat.name] = created.id;
  }

  // 4. Budgets for Current Month
  const now = new Date();
  const currentMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const budgetDefs = [
    { catName: "Alimentation & Courses", limit: 750000 },
    { catName: "Loyer & Charges", limit: 850000 },
    { catName: "Transport & Carburant", limit: 220000 },
    { catName: "Cafés & Sorties", limit: 180000 },
  ];

  for (const b of budgetDefs) {
    const catId = categoriesMap[b.catName];
    if (catId) {
      await prisma.budget.upsert({
        where: {
          userId_categoryId_month: {
            userId: user.id,
            categoryId: catId,
            month: currentMonthDate,
          },
        },
        update: { limitMinor: BigInt(b.limit) },
        create: {
          userId: user.id,
          categoryId: catId,
          month: currentMonthDate,
          limitMinor: BigInt(b.limit),
        },
      });
    }
  }

  // 5. 12 Months of Transactions
  // Clean up existing demo transactions to ensure idempotency
  await prisma.transaction.deleteMany({ where: { userId: user.id } });

  const transactionsData: Array<{
    userId: string;
    accountId: string;
    categoryId: string;
    kind: TransactionKind;
    amountMinor: bigint;
    occurredOn: Date;
    payee: string;
    note?: string;
  }> = [];

  for (let m = 11; m >= 0; m--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - m, 1));
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    // 1st: Monthly Salary
    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Salaire"]!,
      kind: TransactionKind.INCOME,
      amountMinor: BigInt(3200000),
      occurredOn: new Date(Date.UTC(year, month, 1)),
      payee: "Virement Société",
      note: `Salaire ${year}-${String(month + 1).padStart(2, "0")}`,
    });

    // 1st: Rent
    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Loyer & Charges"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(850000),
      occurredOn: new Date(Date.UTC(year, month, 1)),
      payee: "Propriétaire Appartement",
      note: "Loyer mensuel",
    });

    // 10th: Utilities / Internet
    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Factures & Internet"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(68000),
      occurredOn: new Date(Date.UTC(year, month, 10)),
      payee: "Topnet ADSL",
    });

    // Weekly Groceries
    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Alimentation & Courses"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(115000),
      occurredOn: new Date(Date.UTC(year, month, 5)),
      payee: "Carrefour Market",
    });

    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Alimentation & Courses"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(142500),
      occurredOn: new Date(Date.UTC(year, month, 12)),
      payee: "Monoprix Menzah",
    });

    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Alimentation & Courses"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(128000),
      occurredOn: new Date(Date.UTC(year, month, 19)),
      payee: "Marché Central",
    });

    // Transport / Gas
    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Transport & Carburant"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(75000),
      occurredOn: new Date(Date.UTC(year, month, 8)),
      payee: "Kiosque Agil",
    });

    transactionsData.push({
      userId: user.id,
      accountId: accountBiat.id,
      categoryId: categoriesMap["Transport & Carburant"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(80000),
      occurredOn: new Date(Date.UTC(year, month, 22)),
      payee: "Station Shell",
    });

    // Cafés in cash
    transactionsData.push({
      userId: user.id,
      accountId: accountCash.id,
      categoryId: categoriesMap["Cafés & Sorties"]!,
      kind: TransactionKind.EXPENSE,
      amountMinor: BigInt(12500),
      occurredOn: new Date(Date.UTC(year, month, 14)),
      payee: "Café Journal",
    });

    // Occasional Freelance mission
    if (month % 2 === 0) {
      transactionsData.push({
        userId: user.id,
        accountId: accountBiat.id,
        categoryId: categoriesMap["Missions Freelance"]!,
        kind: TransactionKind.INCOME,
        amountMinor: BigInt(850000),
        occurredOn: new Date(Date.UTC(year, month, 25)),
        payee: "Client Tech SARL",
        note: "Prestation conseil",
      });
    }
  }

  // Bulk insert
  await prisma.transaction.createMany({
    data: transactionsData,
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded demo user with 3 accounts, 12 categories, and ${transactionsData.length} transactions.`);
}

if (process.argv[1]?.includes("seed.ts")) {
  seed()
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Seed error:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
