import { Router } from "express";
import * as transactionsController from "./transactions.controller.js";

export const transactionsRouter = Router();

transactionsRouter.get("/export", transactionsController.exportTransactionsCsv);
transactionsRouter.get("/", transactionsController.listTransactions);
transactionsRouter.post("/", transactionsController.createTransaction);
transactionsRouter.get("/:id", transactionsController.getTransaction);
transactionsRouter.patch("/:id", transactionsController.updateTransaction);
transactionsRouter.delete("/:id", transactionsController.deleteTransaction);
