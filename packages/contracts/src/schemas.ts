import { z } from "zod";
import { isValidCalendarDate } from "./dates.js";
import { AccountType, CategoryKind, TransactionKind } from "./enums.js";

// Base validation primitives
export const EmailSchema = z
  .string()
  .trim()
  .min(3)
  .max(255)
  .email("Enter a valid email address.")
  .transform((val) => val.toLowerCase());

export const PasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .max(128, "Password must not exceed 128 characters.");

export const CalendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine(isValidCalendarDate, "Invalid calendar date");

export const MonthStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM");

export const PositiveMinorSchema = z
  .number()
  .int("Amount must be an integer in minor units")
  .positive("Amount must be greater than zero")
  .max(Number.MAX_SAFE_INTEGER, "Amount exceeds maximum safe integer");

// Auth schemas
export const RegisterInputSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(80),
    email: EmailSchema,
    password: PasswordSchema,
  })
  .strict();

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z
  .object({
    email: EmailSchema,
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const ForgotPasswordInputSchema = z
  .object({
    email: EmailSchema,
  })
  .strict();

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;

export const ResetPasswordInputSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: PasswordSchema,
  })
  .strict();

export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;

export const ChangePasswordInputSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: PasswordSchema,
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>;

// User schemas
export const UpdateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    currency: z.enum(["TND", "EUR", "USD"]).optional(),
    locale: z.string().trim().min(2).max(20).optional(),
    timezone: z.string().trim().min(2).max(50).optional(),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// Account schemas
export const CreateAccountSchema = z
  .object({
    name: z.string().trim().min(1, "Account name is required").max(60),
    type: z.nativeEnum(AccountType),
    openingBalanceMinor: z
      .number()
      .int()
      .default(0),
  })
  .strict();

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

export const UpdateAccountSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    type: z.nativeEnum(AccountType).optional(),
  })
  .strict();

export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;

// Category schemas
export const CreateCategorySchema = z
  .object({
    name: z.string().trim().min(1, "Category name is required").max(60),
    kind: z.nativeEnum(CategoryKind),
  })
  .strict();

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(60),
  })
  .strict();

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

// Transaction schemas
export const CreateTransactionSchema = z
  .object({
    id: z.string().uuid().optional(),
    accountId: z.string().uuid("Select an account"),
    categoryId: z.string().uuid("Select a category"),
    kind: z.nativeEnum(TransactionKind),
    amountMinor: PositiveMinorSchema,
    occurredOn: CalendarDateSchema,
    payee: z.string().trim().min(1, "Payee is required").max(120),
    note: z.string().trim().max(500).optional().nullable(),
  })
  .strict();

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = z
  .object({
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    kind: z.nativeEnum(TransactionKind).optional(),
    amountMinor: PositiveMinorSchema.optional(),
    occurredOn: CalendarDateSchema.optional(),
    payee: z.string().trim().min(1).max(120).optional(),
    note: z.string().trim().max(500).optional().nullable(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update"
  );

export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;

export const TransactionFiltersSchema = z
  .object({
    from: CalendarDateSchema.optional(),
    to: CalendarDateSchema.optional(),
    kind: z.nativeEnum(TransactionKind).optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    q: z.string().trim().max(100).optional(),
    min: z.coerce.number().int().nonnegative().optional(),
    max: z.coerce.number().int().positive().optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export type TransactionFilters = z.infer<typeof TransactionFiltersSchema>;

// Budget schemas
export const UpsertBudgetSchema = z
  .object({
    limitMinor: PositiveMinorSchema,
  })
  .strict();

export type UpsertBudgetInput = z.infer<typeof UpsertBudgetSchema>;
