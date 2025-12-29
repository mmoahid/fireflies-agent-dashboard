"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ObjectiveCard } from "@/components/objective-card"
import { SyncAgenda } from "@/components/sync-agenda"
import { TodayProgress } from "@/components/today-progress"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { mockObjective, mockAgendaItems, mockPreviousDayItems, getAgendaStats } from "@/lib/mock-data"
import type { AgendaItem } from "@/lib/types"

export default function MorningSyncPage() {
  const [items, setItems] = useState<AgendaItem[]>(mockAgendaItems)
  const agendaStats = getAgendaStats()

  const handleStatusChange = (id: string, status: AgendaItem["status"]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, completedAt: status === "completed" ? new Date() : null } : item,
      ),
    )
  }

  const handleProgressUpdate = (id: string, note: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, progressNote: note } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="bg-transparent">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Morning Sync</h1>
            <p className="text-muted-foreground">Review priorities extracted from recent meetings</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Re-scan Meetings
        </Button>
      </div>

      <ObjectiveCard objective={mockObjective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SyncAgenda
            type="morning"
            items={items}
            previousDayItems={mockPreviousDayItems}
            onStatusChange={handleStatusChange}
            onProgressUpdate={handleProgressUpdate}
          />
        </div>
        <div>
          <TodayProgress stats={agendaStats} />
        </div>
      </div>
    </div>
  )
}
