"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  MoreVertical,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  RefreshCw,
} from "lucide-react"
import type { AgendaItemDTO } from "@/lib/dto"

interface AgendaItemCardProps {
  item: AgendaItemDTO
  showProgressInput?: boolean
  onStatusChange?: (id: string, status: AgendaItemDTO["status"]) => void
  onProgressUpdate?: (id: string, note: string) => void
}

const statusConfig = {
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  in_progress: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Completed" },
  carried_over: { icon: ArrowRight, color: "text-chart-4", bg: "bg-chart-4/10", label: "Carried Over" },
}

const categoryConfig = {
  action_item: { icon: FileCheck, color: "text-primary", label: "Action Item" },
  decision: { icon: Lightbulb, color: "text-warning", label: "Decision" },
  blocker: { icon: AlertTriangle, color: "text-destructive", label: "Blocker" },
  update: { icon: RefreshCw, color: "text-muted-foreground", label: "Update" },
  follow_up: { icon: MessageSquare, color: "text-chart-4", label: "Follow-up" },
}

const priorityConfig = {
  high: { color: "border-destructive text-destructive", label: "High" },
  medium: { color: "border-warning text-warning", label: "Medium" },
  low: { color: "border-muted-foreground text-muted-foreground", label: "Low" },
}

export function AgendaItemCard({ item, showProgressInput, onStatusChange, onProgressUpdate }: AgendaItemCardProps) {
  const [progressNote, setProgressNote] = useState(item.progressNote || "")
  const [isAddingProgress, setIsAddingProgress] = useState(false)

  const status = statusConfig[item.status]
  const category = categoryConfig[item.category]
  const priority = priorityConfig[item.priority]
  const StatusIcon = status.icon
  const CategoryIcon = category.icon

  const handleSaveProgress = () => {
    onProgressUpdate?.(item.id, progressNote)
    setIsAddingProgress(false)
  }

  return (
    <Card
      className={`${status.bg} border-l-4 ${item.category === "blocker" ? "border-l-destructive" : "border-l-transparent"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${status.color}`}>
            <StatusIcon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {item.content}
              </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange?.(item.id, "pending")}>
                    <Circle className="mr-2 h-4 w-4" /> Mark Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(item.id, "in_progress")}>
                    <Clock className="mr-2 h-4 w-4" /> Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(item.id, "completed")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.(item.id, "carried_over")}>
                    <ArrowRight className="mr-2 h-4 w-4" /> Carry Over
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={priority.color}>
                {priority.label}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CategoryIcon className={`h-3 w-3 ${category.color}`} />
                {category.label}
              </Badge>
              {item.sourceMeetingTitle && (
                <span className="text-xs text-muted-foreground">from {item.sourceMeetingTitle}</span>
              )}
            </div>

            {item.progressNote && !isAddingProgress && (
              <div className="rounded-md bg-background/50 p-2 text-xs text-muted-foreground">
                <span className="font-medium">Progress:</span> {item.progressNote}
              </div>
            )}

            {showProgressInput && !item.progressNote && !isAddingProgress && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsAddingProgress(true)}
              >
                <MessageSquare className="mr-1.5 h-3 w-3" />
                Add progress note
              </Button>
            )}

            {isAddingProgress && (
              <div className="space-y-2">
                <Textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Add a progress note..."
                  className="min-h-[60px] text-xs"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs" onClick={handleSaveProgress}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-transparent"
                    onClick={() => setIsAddingProgress(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
