import type { AgendaItem, CompanyObjective } from "@/lib/types"

export type CompanyObjectiveDTO = Omit<CompanyObjective, "updatedAt"> & {
  updatedAt: string
}

export type AgendaItemDTO = Omit<AgendaItem, "createdAt" | "completedAt" | "dayDate"> & {
  createdAt: string
  completedAt: string | null
  dayDate: string
}

