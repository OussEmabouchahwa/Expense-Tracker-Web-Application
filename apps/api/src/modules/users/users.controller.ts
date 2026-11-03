import { Request, Response, NextFunction } from "express";
import * as userService from "./users.service.js";
import { UpdateUserSchema } from "@masrouf/contracts";
import { AppError } from "../../lib/app-error.js";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const parsed = UpdateUserSchema.parse(req.body);
    const updated = await userService.updateProfile(req.user.id, parsed);
    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function exportMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    const exported = await userService.exportUserData(req.user.id);
    res.status(200).json({ data: exported });
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw AppError.unauthorized();
    await userService.deleteAccount(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
