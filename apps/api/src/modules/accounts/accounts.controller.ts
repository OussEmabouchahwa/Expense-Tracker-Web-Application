import { Request, Response, NextFunction } from "express";
import * as accountService from "./accounts.service.js";
import { CreateAccountSchema, UpdateAccountSchema } from "@masrouf/contracts";
import { AppError } from "../../lib/app-error.js";

export async function listAccounts(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const data = await accountService.listAccounts(req.user.id);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = CreateAccountSchema.parse(req.body);
    const created = await accountService.createAccount(req.user.id, parsed);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = UpdateAccountSchema.parse(req.body);
    const updated = await accountService.updateAccount(
      req.user.id,
      req.params.id as string,
      parsed
    );
    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function archiveAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    await accountService.archiveAccount(req.user.id, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
