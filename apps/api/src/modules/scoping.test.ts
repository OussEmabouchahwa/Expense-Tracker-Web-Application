import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/prisma.js";
import * as txRepo from "./transactions/transactions.repository.js";
import * as acctRepo from "./accounts/accounts.repository.js";
import * as catRepo from "./categories/categories.repository.js";
import * as budgetRepo from "./budgets/budgets.repository.js";
import { AccountType, CategoryKind, TransactionKind } from "@prisma/client";

describe("User-Scoped Repositories", () => {
  let userAId: string;
  let userBId: string;
  let accountAId: string;
  let categoryAId: string;
  let transactionAId: string;

  beforeAll(async () => {
    // Create User A and User B
    const userA = await prisma.user.create({
      data: {
        email: "user-a-test@masrouf.test",
        passwordHash: "hash-a",
        name: "User A",
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: "user-b-test@masrouf.test",
        passwordHash: "hash-b",
        name: "User B",
      },
    });
    userBId = userB.id;

    // Create Account and Category for User A
    const acct = await acctRepo.createAccount(userAId, {
      name: "User A Bank",
      type: AccountType.BANK,
      openingBalanceMinor: 100000,
    });
    accountAId = acct.id;

    const cat = await catRepo.createCategory(userAId, {
      name: "User A Groceries",
      kind: CategoryKind.EXPENSE,
    });
    categoryAId = cat.id;

    // Create Transaction for User A
    const tx = await txRepo.createTransactionForUser(userAId, {
      accountId: accountAId,
      categoryId: categoryAId,
      kind: TransactionKind.EXPENSE,
      amountMinor: 25000,
      occurredOn: "2026-10-15",
      payee: "Local Store",
    });
    transactionAId = tx.id;

    // Create Budget for User A
    await budgetRepo.upsertBudget(userAId, categoryAId, "2026-10", 150000);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [userAId, userBId] } },
    });
  });

  it("User B cannot find User A's transaction", async () => {
    const found = await txRepo.findTransactionForUser(userBId, transactionAId);
    expect(found).toBeNull();
  });

  it("User B transaction list returns none of User A's transactions", async () => {
    const list = await txRepo.listTransactionsForUser(userBId, { limit: 25 });
    expect(list.items).toHaveLength(0);
  });

  it("User B cannot find User A's account", async () => {
    const found = await acctRepo.findAccountForUser(userBId, accountAId);
    expect(found).toBeNull();
  });

  it("User B account list does not include User A's account", async () => {
    const list = await acctRepo.listAccountsForUser(userBId);
    expect(list).toHaveLength(0);
  });

  it("User B cannot find User A's category", async () => {
    const found = await catRepo.findCategoryForUser(userBId, categoryAId);
    expect(found).toBeNull();
  });

  it("User B category list does not include User A's category", async () => {
    const list = await catRepo.listCategoriesForUser(userBId);
    expect(list).toHaveLength(0);
  });

  it("User B budget list does not include User A's budget", async () => {
    const list = await budgetRepo.listBudgetsForMonth(userBId, "2026-10");
    expect(list).toHaveLength(0);
  });
});
