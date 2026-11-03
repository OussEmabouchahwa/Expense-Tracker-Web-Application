import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
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
