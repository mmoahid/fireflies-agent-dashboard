import "server-only"

import { z } from "zod"

function normalizeEnvValue(value: string) {
  let v = value.trim()
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    v = v.slice(1, -1).trim()
  }
  return v
}

const requiredString = z
  .string()
  .transform(normalizeEnvValue)
  .refine((v) => v.length > 0, "Required")

const optionalString = z
  .string()
  .optional()
  .transform((v) => {
    const normalized = normalizeEnvValue(v ?? "")
    return normalized.length ? normalized : undefined
  })

const EnvSchema = z.object({
  DATABASE_URL: requiredString,
  DIRECT_URL: requiredString,

  FIREFLIES_API_KEY: requiredString,
  GEMINI_API_KEY: optionalString,

  SUPABASE_URL: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,

  DASHBOARD_USERNAME: requiredString,
  DASHBOARD_PASSWORD: requiredString,
})

export type Env = z.infer<typeof EnvSchema>

let cachedEnv: Env | null = null

export function env(): Env {
  if (cachedEnv) return cachedEnv
  cachedEnv = EnvSchema.parse(process.env)
  return cachedEnv
}

export function applySanitizedEnvToProcess() {
  const e = env()
  process.env.DATABASE_URL = e.DATABASE_URL
  process.env.DIRECT_URL = e.DIRECT_URL
  process.env.FIREFLIES_API_KEY = e.FIREFLIES_API_KEY
  process.env.DASHBOARD_USERNAME = e.DASHBOARD_USERNAME
  process.env.DASHBOARD_PASSWORD = e.DASHBOARD_PASSWORD
  if (e.GEMINI_API_KEY) process.env.GEMINI_API_KEY = e.GEMINI_API_KEY
  if (e.SUPABASE_URL) process.env.SUPABASE_URL = e.SUPABASE_URL
  if (e.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = e.SUPABASE_SERVICE_ROLE_KEY
}
