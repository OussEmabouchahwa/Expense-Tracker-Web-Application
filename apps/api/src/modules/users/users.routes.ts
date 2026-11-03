import { Router } from "express";
import * as userController from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/me", userController.getMe);
usersRouter.patch("/me", userController.updateMe);
usersRouter.get("/me/export", userController.exportMe);
usersRouter.delete("/me", userController.deleteMe);
