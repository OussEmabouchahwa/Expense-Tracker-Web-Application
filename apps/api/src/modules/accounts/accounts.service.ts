import * as accountRepo from "./accounts.repository.js";
import { AppError } from "../../lib/app-error.js";
import { CreateAccountInput, UpdateAccountInput } from "@masrouf/contracts";
import { AccountType } from "@prisma/client";

export async function listAccounts(userId: string) {
  return accountRepo.listAccountsForUser(userId);
}

export async function createAccount(userId: string, input: CreateAccountInput) {
  return accountRepo.createAccount(userId, {
    name: input.name,
    type: input.type as AccountType,
    openingBalanceMinor: input.openingBalanceMinor,
  });
}

export async function updateAccount(
  userId: string,
  id: string,
  input: UpdateAccountInput
) {
  const existing = await accountRepo.findAccountForUser(userId, id);
  if (!existing) {
    throw AppError.notFound("Account not found");
  }

  await accountRepo.updateAccount(userId, id, {
    name: input.name,
    type: input.type ? (input.type as AccountType) : undefined,
  });

  return accountRepo.findAccountForUser(userId, id);
}

export async function archiveAccount(userId: string, id: string) {
  const existing = await accountRepo.findAccountForUser(userId, id);
  if (!existing) {
    throw AppError.notFound("Account not found");
  }
  await accountRepo.archiveAccount(userId, id);
}
