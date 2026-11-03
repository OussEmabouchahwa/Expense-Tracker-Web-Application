import { prisma } from "../../lib/prisma.js";
import { AccountType } from "@prisma/client";

export interface AccountWithBalance {
  id: string;
  name: string;
  type: AccountType;
  openingBalanceMinor: number;
  balanceMinor: number;
  archivedAt: Date | null;
}

export async function listAccountsForUser(userId: string): Promise<AccountWithBalance[]> {
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  const balances: Array<{ accountId: string; delta: bigint }> = await prisma.$queryRaw`
    SELECT "accountId",
           COALESCE(SUM(CASE WHEN kind = 'INCOME' THEN "amountMinor" ELSE -"amountMinor" END), 0) as delta
    FROM transactions
    WHERE "userId" = ${userId} AND "deletedAt" IS NULL
    GROUP BY "accountId"
  `;

  const deltaMap = new Map<string, number>();
  for (const b of balances) {
    deltaMap.set(b.accountId, Number(b.delta));
  }

  return accounts.map((acc) => {
    const opening = Number(acc.openingBalanceMinor);
    const delta = deltaMap.get(acc.id) ?? 0;
    return {
      id: acc.id,
      name: acc.name,
      type: acc.type,
      openingBalanceMinor: opening,
      balanceMinor: opening + delta,
      archivedAt: acc.archivedAt,
    };
  });
}

export async function findAccountForUser(userId: string, accountId: string) {
  return prisma.account.findFirst({
    where: { id: accountId, userId },
  });
}

export async function createAccount(
  userId: string,
  data: { name: string; type: AccountType; openingBalanceMinor: number }
) {
  return prisma.account.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      openingBalanceMinor: BigInt(data.openingBalanceMinor),
    },
  });
}

export async function updateAccount(
  userId: string,
  accountId: string,
  data: { name?: string; type?: AccountType }
) {
  return prisma.account.updateMany({
    where: { id: accountId, userId },
    data,
  });
}

export async function archiveAccount(userId: string, accountId: string) {
  return prisma.account.updateMany({
    where: { id: accountId, userId },
    data: { archivedAt: new Date() },
  });
}
