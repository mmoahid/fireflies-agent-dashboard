"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ObjectiveCard } from "@/components/objective-card"
import { SyncAgenda } from "@/components/sync-agenda"
import { TodayProgress } from "@/components/today-progress"
import { ArrowLeft, Save, ArrowRight } from "lucide-react"
import { mockObjective, mockAgendaItems, getAgendaStats } from "@/lib/mock-data"
import type { AgendaItem } from "@/lib/types"

export default function AfternoonWrapUpPage() {
  const [items, setItems] = useState<AgendaItem[]>(mockAgendaItems)
  const [wrapUpNotes, setWrapUpNotes] = useState("")
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

  const incompleteItems = items.filter((i) => i.status !== "completed")

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
            <h1 className="text-2xl font-bold text-foreground">Afternoon Wrap-Up</h1>
            <p className="text-muted-foreground">Update progress and prepare for tomorrow</p>
          </div>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save & Close Day
        </Button>
      </div>

      <ObjectiveCard objective={mockObjective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SyncAgenda
            type="afternoon"
            items={items}
            onStatusChange={handleStatusChange}
            onProgressUpdate={handleProgressUpdate}
          />

          {/* Wrap-up notes card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">End of Day Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add any additional notes, learnings, or context for tomorrow's sync..."
                value={wrapUpNotes}
                onChange={(e) => setWrapUpNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TodayProgress stats={agendaStats} />

          {/* Items to carry over */}
          {incompleteItems.length > 0 && (
            <Card className="border-chart-4/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRight className="h-5 w-5 text-chart-4" />
                  Carry to Tomorrow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {incompleteItems.length} item{incompleteItems.length > 1 ? "s" : ""} will be carried over to
                  tomorrow&apos;s morning sync.
                </p>
                <ul className="space-y-2">
                  {incompleteItems.slice(0, 3).map((item) => (
                    <li key={item.id} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-chart-4 mt-1">•</span>
                      <span className="line-clamp-2">{item.content}</span>
                    </li>
                  ))}
                  {incompleteItems.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{incompleteItems.length - 3} more item{incompleteItems.length - 3 > 1 ? "s" : ""}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
