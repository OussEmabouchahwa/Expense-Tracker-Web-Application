import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters long"),
  APP_ORIGIN: z.string().url("APP_ORIGIN must be a valid URL"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  SMTP_URL: z.string().min(1, "SMTP_URL is required"),
  DEFAULT_CURRENCY: z.string().default("TND"),
  DEFAULT_TIMEZONE: z.string().default("Africa/Tunis"),
});

export type Env = z.infer<typeof EnvSchema>;

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (!parsedEnv) {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
      const formatted = result.error.format();
      // eslint-disable-next-line no-console
      console.error("❌ Invalid environment variables:", JSON.stringify(formatted, null, 2));
      throw new Error("Invalid environment configuration. Check logs for details.");
    }
    parsedEnv = result.data;
  }
  return parsedEnv;
}
