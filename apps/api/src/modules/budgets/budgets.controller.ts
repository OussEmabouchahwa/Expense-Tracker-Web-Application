import { Request, Response, NextFunction } from "express";
import * as budgetRepo from "./budgets.repository.js";
import { UpsertBudgetSchema } from "@masrouf/contracts";
import { AppError } from "../../lib/app-error.js";

export async function listBudgets(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const month =
      typeof req.query.month === "string"
        ? req.query.month
        : new Date().toISOString().slice(0, 7);
    const data = await budgetRepo.listBudgetsForMonth(req.user.id, month);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function upsertBudget(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const { categoryId, month } = req.params as { categoryId: string; month: string };
    const parsed = UpsertBudgetSchema.parse(req.body);
    const data = await budgetRepo.upsertBudget(req.user.id, categoryId, month, parsed.limitMinor);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteBudget(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const { categoryId, month } = req.params as { categoryId: string; month: string };
    await budgetRepo.deleteBudget(req.user.id, categoryId, month);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function copyFromPreviousMonth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const month =
      typeof req.query.month === "string"
        ? req.query.month
        : new Date().toISOString().slice(0, 7);
    const count = await budgetRepo.copyBudgetsFromPreviousMonth(req.user.id, month);
    res.status(200).json({ data: { copied: count } });
  } catch (err) {
    next(err);
  }
}
