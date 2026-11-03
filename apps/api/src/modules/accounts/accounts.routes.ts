import { Router } from "express";
import * as accountController from "./accounts.controller.js";

export const accountsRouter = Router();

accountsRouter.get("/", accountController.listAccounts);
accountsRouter.post("/", accountController.createAccount);
accountsRouter.patch("/:id", accountController.updateAccount);
accountsRouter.post("/:id/archive", accountController.archiveAccount);
