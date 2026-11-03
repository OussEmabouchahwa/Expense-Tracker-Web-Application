import { Router } from "express";
import * as categoriesController from "./categories.controller.js";

export const categoriesRouter = Router();

// List and create categories
categoriesRouter.get("/", categoriesController.listCategories);
categoriesRouter.post("/", categoriesController.createCategory);

// Update and archive specific category
categoriesRouter.patch("/:id", categoriesController.updateCategory);
categoriesRouter.post("/:id/archive", categoriesController.archiveCategory);
