import { Request, Response, NextFunction } from "express";
import * as categoryService from "./categories.service.js";
import { CreateCategorySchema, UpdateCategorySchema } from "@masrouf/contracts";
import { AppError } from "../../lib/app-error.js";

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const kind = typeof req.query.kind === "string" ? req.query.kind : undefined;
    const data = await categoryService.listCategories(req.user.id, kind);
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = CreateCategorySchema.parse(req.body);
    const created = await categoryService.createCategory(req.user.id, parsed);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = UpdateCategorySchema.parse(req.body);
    const updated = await categoryService.updateCategory(req.user.id, req.params.id as string, parsed);
    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function archiveCategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    await categoryService.archiveCategory(req.user.id, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
