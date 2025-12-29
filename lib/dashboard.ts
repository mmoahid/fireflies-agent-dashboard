import type { AgendaItem } from "@/lib/types"

export function getNextAction(): { action: string; time: string } {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 9) return { action: "Morning Sync", time: "9:00 AM" }
  if (hour < 12) return { action: "Review Meeting Notes", time: "12:00 PM" }
  if (hour < 17) return { action: "Afternoon Wrap-Up", time: "5:00 PM" }
  return { action: "Morning Sync", time: "Tomorrow 9:00 AM" }
}

export function getAgendaStats(items: AgendaItem[]) {
  const total = items.length
  const completed = items.filter((i) => i.status === "completed").length
  const inProgress = items.filter((i) => i.status === "in_progress").length
  const pending = items.filter((i) => i.status === "pending").length
  const blockers = items.filter((i) => i.category === "blocker").length

  return { total, completed, inProgress, pending, blockers }
}

