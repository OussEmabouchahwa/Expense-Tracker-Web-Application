import { prisma } from "../../lib/prisma.js";
import { TransactionKind, Prisma } from "@prisma/client";

export interface ListTransactionsParams {
  from?: string;
  to?: string;
  kind?: TransactionKind;
  accountId?: string;
  categoryId?: string;
  q?: string;
  min?: number;
  max?: number;
  cursor?: string; // encoded as occurredOn_id
  limit: number;
}

export async function listTransactionsForUser(
  userId: string,
  params: ListTransactionsParams
) {
  const where: Prisma.TransactionWhereInput = {
    userId,
    deletedAt: null,
  };

  if (params.from || params.to) {
    where.occurredOn = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(params.to) } : {}),
    };
  }

  if (params.kind) where.kind = params.kind;
  if (params.accountId) where.accountId = params.accountId;
  if (params.categoryId) where.categoryId = params.categoryId;

  if (params.min !== undefined || params.max !== undefined) {
    where.amountMinor = {
      ...(params.min !== undefined ? { gte: BigInt(params.min) } : {}),
      ...(params.max !== undefined ? { lte: BigInt(params.max) } : {}),
    };
  }

  if (params.q) {
    where.OR = [
      { payee: { contains: params.q, mode: "insensitive" } },
      { note: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // Handle keyset cursor: (occurredOn DESC, id DESC)
  if (params.cursor) {
    const parts = params.cursor.split("_");
    const cursorDate = parts[0];
    const cursorId = parts[1];
    if (cursorDate && cursorId) {
      where.AND = [
        {
          OR: [
            { occurredOn: { lt: new Date(cursorDate) } },
            {
              AND: [
                { occurredOn: { equals: new Date(cursorDate) } },
                { id: { lt: cursorId } },
              ],
            },
          ],
        },
      ];
    }
  }

  const items = await prisma.transaction.findMany({
    where,
    orderBy: [{ occurredOn: "desc" }, { id: "desc" }],
    take: params.limit + 1,
    include: {
      account: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  let nextCursor: string | null = null;
  if (items.length > params.limit) {
    const nextItem = items.pop();
    if (nextItem) {
      const dateStr = nextItem.occurredOn.toISOString().slice(0, 10);
      nextCursor = `${dateStr}_${nextItem.id}`;
    }
  }

  return {
    items: items.map((t) => ({
      ...t,
      amountMinor: Number(t.amountMinor),
      occurredOn: t.occurredOn.toISOString().slice(0, 10),
    })),
    nextCursor,
  };
}

export async function findTransactionForUser(userId: string, id: string) {
  const tx = await prisma.transaction.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      account: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!tx) return null;
  return {
    ...tx,
    amountMinor: Number(tx.amountMinor),
    occurredOn: tx.occurredOn.toISOString().slice(0, 10),
  };
}

export async function createTransactionForUser(
  userId: string,
  data: {
    id?: string;
    accountId: string;
    categoryId: string;
    kind: TransactionKind;
    amountMinor: number;
    occurredOn: string;
    payee: string;
    note?: string | null;
  }
) {
  const created = await prisma.transaction.create({
    data: {
      ...(data.id ? { id: data.id } : {}),
      userId,
      accountId: data.accountId,
      categoryId: data.categoryId,
      kind: data.kind,
      amountMinor: BigInt(data.amountMinor),
      occurredOn: new Date(data.occurredOn),
      payee: data.payee,
      note: data.note,
    },
    include: {
      account: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return {
    ...created,
    amountMinor: Number(created.amountMinor),
    occurredOn: created.occurredOn.toISOString().slice(0, 10),
  };
}

export async function updateTransactionForUser(
  userId: string,
  id: string,
  data: {
    accountId?: string;
    categoryId?: string;
    kind?: TransactionKind;
    amountMinor?: number;
    occurredOn?: string;
    payee?: string;
    note?: string | null;
  }
) {
  const updated = await prisma.transaction.updateMany({
    where: { id, userId, deletedAt: null },
    data: {
      ...(data.accountId ? { accountId: data.accountId } : {}),
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.kind ? { kind: data.kind } : {}),
      ...(data.amountMinor !== undefined ? { amountMinor: BigInt(data.amountMinor) } : {}),
      ...(data.occurredOn ? { occurredOn: new Date(data.occurredOn) } : {}),
      ...(data.payee ? { payee: data.payee } : {}),
      ...(data.note !== undefined ? { note: data.note } : {}),
    },
  });

  return updated.count > 0;
}

export async function softDeleteTransactionForUser(userId: string, id: string) {
  const result = await prisma.transaction.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  return result.count > 0;
}

export async function restoreTransactionForUser(userId: string, id: string) {
  const result = await prisma.transaction.updateMany({
    where: { id, userId, deletedAt: { not: null } },
    data: { deletedAt: null },
  });
  return result.count > 0;
}
