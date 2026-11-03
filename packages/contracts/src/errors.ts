export const AppErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  BAD_REQUEST: "BAD_REQUEST",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];

export interface ApiErrorResponse {
  error: {
    code: AppErrorCode | string;
    message: string;
    fields?: Record<string, string>;
    requestId: string;
  };
}

export interface ApiSuccessResponse<T, M = Record<string, unknown>> {
  data: T;
  meta?: M;
}
