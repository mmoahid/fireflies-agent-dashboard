import "server-only"

import type { SystemStatusInfo } from "@/lib/types"
import { env } from "@/lib/env"

export function getSystemStatus(): SystemStatusInfo {
  const e = env()

  return {
    fireflies: e.FIREFLIES_API_KEY ? "connected" : "disconnected",
    gemini: e.GEMINI_API_KEY ? "connected" : "disconnected",
    agendaSystem: "connected",
    googleDocs: "disconnected",
  }
}

