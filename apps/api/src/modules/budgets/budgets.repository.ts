import { prisma } from "../../lib/prisma.js";
import { monthRange, getPreviousMonth } from "@masrouf/contracts";

export async function listBudgetsForMonth(userId: string, month: string) {
  const { start, nextStart } = monthRange(month);
  const monthDate = new Date(start);

  const budgets = await prisma.budget.findMany({
    where: { userId, month: monthDate },
    include: {
      category: { select: { id: true, name: true, kind: true } },
    },
  });

  // Query actual spend for each category in that month
  const spendList: Array<{ categoryId: string; totalSpent: bigint }> = await prisma.$queryRaw`
    SELECT "categoryId", COALESCE(SUM("amountMinor"), 0) as "totalSpent"
    FROM transactions
    WHERE "userId" = ${userId}
      AND kind = 'EXPENSE'
      AND "deletedAt" IS NULL
      AND "occurredOn" >= ${new Date(start)}
      AND "occurredOn" < ${new Date(nextStart)}
    GROUP BY "categoryId"
  `;

  const spendMap = new Map<string, number>();
  for (const s of spendList) {
    spendMap.set(s.categoryId, Number(s.totalSpent));
  }

  return budgets.map((b) => {
    const limitMinor = Number(b.limitMinor);
    const spentMinor = spendMap.get(b.categoryId) ?? 0;
    return {
      id: b.id,
      categoryId: b.categoryId,
      categoryName: b.category.name,
      month,
      limitMinor,
      spentMinor,
    };
  });
}

export async function upsertBudget(
  userId: string,
  categoryId: string,
  month: string,
  limitMinor: number
) {
  const { start } = monthRange(month);
  const monthDate = new Date(start);

  return prisma.budget.upsert({
    where: {
      userId_categoryId_month: {
        userId,
        categoryId,
        month: monthDate,
      },
    },
    update: { limitMinor: BigInt(limitMinor) },
    create: {
      userId,
      categoryId,
      month: monthDate,
      limitMinor: BigInt(limitMinor),
    },
  });
}

export async function deleteBudget(
  userId: string,
  categoryId: string,
  month: string
) {
  const { start } = monthRange(month);
  const monthDate = new Date(start);

  return prisma.budget.deleteMany({
    where: {
      userId,
      categoryId,
      month: monthDate,
    },
  });
}

export async function copyBudgetsFromPreviousMonth(
  userId: string,
  targetMonth: string
): Promise<number> {
  const prevMonth = getPreviousMonth(targetMonth);
  const { start: prevStart } = monthRange(prevMonth);
  const { start: targetStart } = monthRange(targetMonth);

  const prevBudgets = await prisma.budget.findMany({
    where: { userId, month: new Date(prevStart) },
  });

  let copied = 0;
  for (const pb of prevBudgets) {
    await prisma.budget.upsert({
      where: {
        userId_categoryId_month: {
          userId,
          categoryId: pb.categoryId,
          month: new Date(targetStart),
        },
      },
      update: { limitMinor: pb.limitMinor },
      create: {
        userId,
        categoryId: pb.categoryId,
        month: new Date(targetStart),
        limitMinor: pb.limitMinor,
      },
    });
    copied++;
  }

  return copied;
}
