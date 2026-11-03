import { Router } from "express";
import * as budgetsController from "./budgets.controller.js";

export const budgetsRouter = Router();

budgetsRouter.get("/", budgetsController.listBudgets);
budgetsRouter.put("/:categoryId/:month", budgetsController.upsertBudget);
budgetsRouter.delete("/:categoryId/:month", budgetsController.deleteBudget);
budgetsRouter.post("/copy", budgetsController.copyFromPreviousMonth);
