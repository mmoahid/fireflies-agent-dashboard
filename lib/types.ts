// TypeScript interfaces matching Prisma schema

export interface Meeting {
  id: string
  firefliesMeetingId: string
  title: string
  dateTime: Date
  participants: string[]
  kamParticipated: boolean
  transcriptUrl: string | null
  summary: string | null
  status: "pending" | "processed" | "error"
  createdAt: Date
  updatedAt: Date
  extractedInsights: ExtractedInsight[]
}

export interface ExtractedInsight {
  id: string
  content: string
  relevanceScore: number // 0-100 how relevant to objective
  category: "action_item" | "decision" | "blocker" | "update" | "follow_up"
  meetingId: string
}

export interface AgendaItem {
  id: string
  content: string
  status: "pending" | "in_progress" | "completed" | "carried_over"
  priority: "high" | "medium" | "low"
  sourceMeetingId: string | null
  sourceMeetingTitle: string | null
  category: "action_item" | "decision" | "blocker" | "update" | "follow_up"
  progressNote: string | null
  createdAt: Date
  completedAt: Date | null
  dayDate: Date // The day this item belongs to
}

export interface DailySync {
  id: string
  date: Date
  morningAgendaItems: AgendaItem[]
  afternoonStatus: "not_started" | "in_progress" | "completed"
  morningNotes: string | null
  afternoonNotes: string | null
}

export interface CompanyObjective {
  id: string
  content: string
  updatedAt: Date
}

export interface SystemLog {
  id: string
  action: string
  status: "success" | "error" | "pending"
  message: string | null
  createdAt: Date
}

export type SystemStatus = "connected" | "disconnected" | "error"

export interface SystemStatusInfo {
  fireflies: SystemStatus
  gemini: SystemStatus
  agendaSystem: SystemStatus
}
