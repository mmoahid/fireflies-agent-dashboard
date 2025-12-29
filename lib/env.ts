import "server-only"

import { z } from "zod"

const trimString = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v.length > 0, "Required")

const EnvSchema = z.object({
  DATABASE_URL: trimString,
  DIRECT_URL: trimString,

  FIREFLIES_API_KEY: trimString,
  GEMINI_API_KEY: z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .optional(),

  SUPABASE_URL: z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .optional(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .optional(),

  DASHBOARD_USERNAME: trimString,
  DASHBOARD_PASSWORD: trimString,
})

export type Env = z.infer<typeof EnvSchema>

let cachedEnv: Env | null = null

export function env(): Env {
  if (cachedEnv) return cachedEnv
  cachedEnv = EnvSchema.parse(process.env)
  return cachedEnv
}

