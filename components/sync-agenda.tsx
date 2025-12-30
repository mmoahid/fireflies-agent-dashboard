"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AgendaItemCard } from "@/components/agenda-item-card"
import { Sun, Moon, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import type { AgendaItemDTO } from "@/lib/dto"

interface SyncAgendaProps {
  type: "morning" | "afternoon"
  items: AgendaItemDTO[]
  previousDayItems?: AgendaItemDTO[]
  onStatusChange?: (id: string, status: AgendaItemDTO["status"]) => void
  onProgressUpdate?: (id: string, note: string) => void
}

export function SyncAgenda({ type, items, previousDayItems, onStatusChange, onProgressUpdate }: SyncAgendaProps) {
  const isMorning = type === "morning"
  const Icon = isMorning ? Sun : Moon
  const iconColor = isMorning ? "text-warning" : "text-chart-4"

  const stats = {
    total: items.length,
    completed: items.filter((i) => i.status === "completed").length,
    inProgress: items.filter((i) => i.status === "in_progress").length,
    pending: items.filter((i) => i.status === "pending").length,
    blockers: items.filter((i) => i.category === "blocker" && i.status !== "completed").length,
  }

  // For afternoon, show carried over items from previous day
  const carriedOver = previousDayItems?.filter((i) => i.status === "carried_over") || []

  // Sort items: blockers first, then by priority
  const sortedItems = [...items].sort((a, b) => {
    if (a.category === "blocker" && b.category !== "blocker") return -1
    if (a.category !== "blocker" && b.category === "blocker") return 1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${isMorning ? "bg-warning/10" : "bg-chart-4/10"}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <CardTitle>{isMorning ? "Morning Sync" : "Afternoon Wrap-Up"}</CardTitle>
              <CardDescription>
                {isMorning ? "Review priorities extracted from recent meetings" : "Update progress on today's items"}
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge variant="secondary" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            {stats.completed}/{stats.total} done
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3.5 w-3.5 text-warning" />
            {stats.inProgress} in progress
          </Badge>
          {stats.blockers > 0 && (
            <Badge variant="destructive" className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {stats.blockers} blocker{stats.blockers > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Show carried over items in morning sync */}
        {isMorning && carriedOver.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ArrowRight className="h-4 w-4" />
              Carried over from yesterday
            </div>
            {carriedOver.map((item) => (
              <AgendaItemCard
                key={item.id}
                item={item}
                showProgressInput={!isMorning}
                onStatusChange={onStatusChange}
                onProgressUpdate={onProgressUpdate}
              />
            ))}
          </div>
        )}

        {/* Main agenda items */}
        <div className="space-y-2">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <AgendaItemCard
                key={item.id}
                item={item}
                showProgressInput={!isMorning}
                onStatusChange={onStatusChange}
                onProgressUpdate={onProgressUpdate}
              />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No agenda items for today.</p>
              <p className="text-sm">Items will be extracted from your meetings automatically.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
