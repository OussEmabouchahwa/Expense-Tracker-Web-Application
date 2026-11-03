import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppErrorCode } from "@masrouf/contracts";
import { AppError } from "../lib/app-error.js";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.id || "unknown";

  if (err instanceof AppError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields,
        requestId,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".") || "root";
      fields[path] = issue.message;
    }

    res.status(422).json({
      error: {
        code: AppErrorCode.VALIDATION_ERROR,
        message: "Check the highlighted fields.",
        fields,
        requestId,
      },
    });
    return;
  }

  logger.error(
    {
      requestId,
      err: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    },
    "Unhandled server error"
  );

  res.status(500).json({
    error: {
      code: AppErrorCode.INTERNAL_ERROR,
      message: "An internal server error occurred.",
      requestId,
    },
  });
}
