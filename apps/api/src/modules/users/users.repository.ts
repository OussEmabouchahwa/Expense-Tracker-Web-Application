import { prisma } from "../../lib/prisma.js";

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      currency: true,
      locale: true,
      timezone: true,
      createdAt: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function updateUser(
  userId: string,
  data: { name?: string; currency?: string; locale?: string; timezone?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      currency: true,
      locale: true,
      timezone: true,
    },
  });
}

export async function deleteUserAndAllData(userId: string): Promise<void> {
  // Cascades automatically to accounts, categories, transactions, budgets, sessions, tokens
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function exportAllUserData(userId: string) {
  const [user, accounts, categories, transactions, budgets] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.account.findMany({ where: { userId } }),
    prisma.category.findMany({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId } }),
    prisma.budget.findMany({ where: { userId } }),
  ]);

  return {
    user,
    accounts,
    categories,
    transactions,
    budgets,
  };
}
