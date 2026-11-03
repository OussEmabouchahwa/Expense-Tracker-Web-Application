import { prisma } from "../../lib/prisma.js";
import { CategoryKind } from "@prisma/client";

export async function listCategoriesForUser(userId: string, kind?: CategoryKind) {
  return prisma.category.findMany({
    where: {
      userId,
      ...(kind ? { kind } : {}),
      archivedAt: null,
    },
    orderBy: { name: "asc" },
  });
}

export async function findCategoryForUser(userId: string, categoryId: string) {
  return prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
}

export async function createCategory(
  userId: string,
  data: { name: string; kind: CategoryKind }
) {
  return prisma.category.create({
    data: {
      userId,
      name: data.name,
      kind: data.kind,
    },
  });
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  name: string
) {
  return prisma.category.updateMany({
    where: { id: categoryId, userId },
    data: { name },
  });
}

export async function archiveCategory(userId: string, categoryId: string) {
  return prisma.category.updateMany({
    where: { id: categoryId, userId },
    data: { archivedAt: new Date() },
  });
}
