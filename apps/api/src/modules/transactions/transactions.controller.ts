import { Request, Response, NextFunction } from "express";
import * as transactionRepo from "./transactions.repository.js";
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  TransactionFiltersSchema,
} from "@masrouf/contracts";
import { AppError } from "../../lib/app-error.js";
import { TransactionKind } from "@prisma/client";

export async function listTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const filters = TransactionFiltersSchema.parse(req.query);
    const result = await transactionRepo.listTransactionsForUser(req.user.id, {
      ...filters,
      kind: filters.kind as TransactionKind | undefined,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const tx = await transactionRepo.findTransactionForUser(req.user.id, req.params.id as string);
    if (!tx) throw AppError.notFound("Transaction not found");
    res.status(200).json({ data: tx });
  } catch (err) {
    next(err);
  }
}

export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = CreateTransactionSchema.parse(req.body);
    const created = await transactionRepo.createTransactionForUser(req.user.id, {
      ...parsed,
      kind: parsed.kind as TransactionKind,
    });
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = UpdateTransactionSchema.parse(req.body);
    const ok = await transactionRepo.updateTransactionForUser(req.user.id, req.params.id as string, {
      ...parsed,
      kind: parsed.kind as TransactionKind | undefined,
    });
    if (!ok) throw AppError.notFound("Transaction not found");
    const updated = await transactionRepo.findTransactionForUser(req.user.id, req.params.id as string);
    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const ok = await transactionRepo.softDeleteTransactionForUser(req.user.id, req.params.id as string);
    if (!ok) throw AppError.notFound("Transaction not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function exportTransactionsCsv(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const filters = TransactionFiltersSchema.parse({ ...req.query, limit: 1000 });
    const result = await transactionRepo.listTransactionsForUser(req.user.id, {
      ...filters,
      kind: filters.kind as TransactionKind | undefined,
    });

    const header = "date,payee,category,account,kind,amount\n";
    const rows = result.items
      .map((t) => {
        const safeStr = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
        return [
          t.occurredOn,
          safeStr(t.payee),
          safeStr(t.category.name),
          safeStr(t.account.name),
          t.kind,
          t.amountMinor,
        ].join(",");
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="transactions.csv"');
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
}
