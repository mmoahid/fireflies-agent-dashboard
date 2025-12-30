"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ObjectiveCard } from "@/components/objective-card"
import { SyncAgenda } from "@/components/sync-agenda"
import { TodayProgress } from "@/components/today-progress"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { AgendaItemDTO, CompanyObjectiveDTO } from "@/lib/dto"
import { getAgendaStats } from "@/lib/dashboard"
import { queueFirefliesSync, saveObjective, updateAgendaStatus } from "@/lib/actions"
import { toast } from "sonner"

interface MorningSyncPageClientProps {
  objective: CompanyObjectiveDTO
  items: AgendaItemDTO[]
  previousDayItems: AgendaItemDTO[]
}

export function MorningSyncPageClient({ objective, items: initialItems, previousDayItems }: MorningSyncPageClientProps) {
  const [items, setItems] = useState<AgendaItemDTO[]>(initialItems)
  const [isPending, startTransition] = useTransition()

  const agendaStats = getAgendaStats(items)

  const handleStatusChange = (id: string, status: AgendaItemDTO["status"]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, completedAt: status === "completed" ? new Date().toISOString() : null }
          : item,
      ),
    )

    startTransition(async () => {
      try {
        await updateAgendaStatus(id, status)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update item"
        toast.error("Could not update agenda item", { description: message })
      }
    })
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
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              try {
                const job = await queueFirefliesSync()
                toast.success("Meeting sync queued", { description: `${job.type} (${job.status})` })
              } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to queue job"
                toast.error("Could not queue job", { description: message })
              }
            })
          }
        >
          <RefreshCw className="h-4 w-4" />
          Re-scan Meetings
        </Button>
      </div>

      <ObjectiveCard objective={objective} onSave={saveObjective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SyncAgenda type="morning" items={items} previousDayItems={previousDayItems} onStatusChange={handleStatusChange} />
        </div>
        <div>
          <TodayProgress stats={agendaStats} />
        </div>
      </div>
    </div>
  )
}
