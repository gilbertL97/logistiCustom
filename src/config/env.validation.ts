import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_DRIVER: z.enum(["prisma", "drizzle", "typeorm"]).default("prisma"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(64),
  JWT_TTL_HOURS: z.coerce.number().default(12),
  APK_SECRET: z.string().min(32),
  GRACE_HOURS: z.coerce.number().default(48),
  TRIAL_DAYS: z.coerce.number().default(7),
  MAX_RENEWALS: z.coerce.number().default(3),
  ADMIN_JWT_SECRET: z.string().min(64),
  ADMIN_TOKEN_TTL_HOURS: z.coerce.number().default(8),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(6),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }
  return parsed.data;
}

export const config = validateEnv();