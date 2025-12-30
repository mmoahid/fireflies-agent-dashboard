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

const CoreEnvSchema = z.object({
  DATABASE_URL: requiredString,
  DIRECT_URL: optionalString,
  DASHBOARD_USERNAME: optionalString,
  DASHBOARD_PASSWORD: optionalString,
})

const IntegrationsEnvSchema = z.object({
  FIREFLIES_API_KEY: requiredString,
  GEMINI_API_KEY: optionalString,
})

const WorkerEnvSchema = z.object({
  SUPABASE_URL: requiredString,
  SUPABASE_SERVICE_ROLE_KEY: requiredString,
})

export type CoreEnv = z.infer<typeof CoreEnvSchema>
export type IntegrationsEnv = z.infer<typeof IntegrationsEnvSchema>
export type WorkerEnv = z.infer<typeof WorkerEnvSchema>

let cachedCore: CoreEnv | null = null
export function envCore(): CoreEnv {
  if (cachedCore) return cachedCore
  cachedCore = CoreEnvSchema.parse(process.env)
  return cachedCore
}

export function envIntegrations(): IntegrationsEnv {
  return IntegrationsEnvSchema.parse(process.env)
}

export function envWorker(): WorkerEnv {
  return WorkerEnvSchema.parse(process.env)
}

export function applySanitizedEnvToProcess() {
  const core = envCore()
  process.env.DATABASE_URL = core.DATABASE_URL
  if (core.DIRECT_URL) process.env.DIRECT_URL = core.DIRECT_URL

  const maybe = (name: string) => {
    const raw = process.env[name]
    const normalized = normalizeEnvValue(raw ?? "")
    if (normalized.length) process.env[name] = normalized
  }

  maybe("DASHBOARD_USERNAME")
  maybe("DASHBOARD_PASSWORD")
  maybe("FIREFLIES_API_KEY")
  maybe("GEMINI_API_KEY")
  maybe("SUPABASE_URL")
  maybe("SUPABASE_SERVICE_ROLE_KEY")
}
