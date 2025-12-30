import "server-only"

import type { SystemStatusInfo } from "@/lib/types"
import { applySanitizedEnvToProcess } from "@/lib/env"

export function getSystemStatus(): SystemStatusInfo {
  applySanitizedEnvToProcess()

  return {
    fireflies: process.env.FIREFLIES_API_KEY ? "connected" : "disconnected",
    gemini: process.env.GEMINI_API_KEY ? "connected" : "disconnected",
    agendaSystem: "connected",
    googleDocs: "disconnected",
  }
}
