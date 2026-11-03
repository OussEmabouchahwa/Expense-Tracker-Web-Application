import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { devAuthStub } from "./middleware/auth-stub.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { accountsRouter } from "./modules/accounts/accounts.routes.js";
import { categoriesRouter } from "./modules/categories/categories.routes.js";
import { transactionsRouter } from "./modules/transactions/transactions.routes.js";
import { budgetsRouter } from "./modules/budgets/budgets.routes.js";
import { logger } from "./lib/logger.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { errorHandler } from "./middleware/error-handler.js";
import { AppError } from "./lib/app-error.js";

export function createApp(): Express {
  const app = express();

  // Security headers & CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.use(express.json({ limit: "100kb" }));

  // Request logging with redaction
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === "/health" || req.url === "/ready",
      },
    })
  );

  // Health and Readiness
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/ready", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ready" });
  });

   // Development auth stub
   app.use(devAuthStub);

   // API routers
   app.use('/api/users', usersRouter);
   app.use('/api/accounts', accountsRouter);
   app.use('/api/categories', categoriesRouter);
   app.use('/api/transactions', transactionsRouter);
   app.use('/api/budgets', budgetsRouter);

   return app;
}

export function finalizeApp(app: Express): void {
  // 404 handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound("Route not found"));
  });

  // Global error handler
  app.use(errorHandler);
}
