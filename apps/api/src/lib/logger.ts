import pino from "pino";

export const REDACTED_KEYS = [
  "password",
  "passwordHash",
  "currentPassword",
  "newPassword",
  "cookie",
  "authorization",
  "csrfToken",
  "token",
  "email",
  "amountMinor",
  "payee",
  "note",
  "openingBalanceMinor",
  "limitMinor",
  "balanceMinor",
  "*.password",
  "*.passwordHash",
  "*.email",
  "*.amountMinor",
  "*.payee",
  "*.note",
  "req.headers.cookie",
  "req.headers.authorization",
  "req.headers['x-csrf-token']",
];

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "test" ? "silent" : "info"),
  redact: {
    paths: REDACTED_KEYS,
    censor: "[REDACTED]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
