import * as categoryRepo from "./categories.repository.js";
import { AppError } from "../../lib/app-error.js";
import { CreateCategoryInput, UpdateCategoryInput } from "@masrouf/contracts";
import { CategoryKind } from "@prisma/client";

export async function listCategories(userId: string, kind?: string) {
  const parsedKind =
    kind === "EXPENSE"
      ? CategoryKind.EXPENSE
      : kind === "INCOME"
      ? CategoryKind.INCOME
      : undefined;

  return categoryRepo.listCategoriesForUser(userId, parsedKind);
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  try {
    return await categoryRepo.createCategory(userId, {
      name: input.name,
      kind: input.kind as CategoryKind,
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "P2002"
    ) {
      throw AppError.conflict("A category with this name and kind already exists.");
    }
    throw err;
  }
}

export async function updateCategory(
  userId: string,
  id: string,
  input: UpdateCategoryInput
) {
  const existing = await categoryRepo.findCategoryForUser(userId, id);
  if (!existing) {
    throw AppError.notFound("Category not found");
  }

  await categoryRepo.updateCategory(userId, id, input.name);
  return categoryRepo.findCategoryForUser(userId, id);
}

export async function archiveCategory(userId: string, id: string) {
  const existing = await categoryRepo.findCategoryForUser(userId, id);
  if (!existing) {
    throw AppError.notFound("Category not found");
  }
  await categoryRepo.archiveCategory(userId, id);
}
