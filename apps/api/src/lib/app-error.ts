import { AppErrorCode } from "@masrouf/contracts";

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly fields?: Record<string, string>;

  constructor(
    code: string,
    status: number,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, fields?: Record<string, string>): AppError {
    return new AppError(AppErrorCode.BAD_REQUEST, 400, message, fields);
  }

  static validation(message: string, fields?: Record<string, string>): AppError {
    return new AppError(AppErrorCode.VALIDATION_ERROR, 422, message, fields);
  }

  static unauthorized(message: string = "Authentication required"): AppError {
    return new AppError(AppErrorCode.UNAUTHORIZED, 401, message);
  }

  static forbidden(message: string = "Access denied"): AppError {
    return new AppError(AppErrorCode.FORBIDDEN, 403, message);
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(AppErrorCode.NOT_FOUND, 404, message);
  }

  static conflict(message: string): AppError {
    return new AppError(AppErrorCode.CONFLICT, 409, message);
  }

  static rateLimited(message: string = "Too many requests. Please try again later."): AppError {
    return new AppError(AppErrorCode.RATE_LIMITED, 429, message);
  }

  static internal(message: string = "An unexpected error occurred"): AppError {
    return new AppError(AppErrorCode.INTERNAL_ERROR, 500, message);
  }
}
