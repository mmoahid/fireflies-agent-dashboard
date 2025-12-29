"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react"

interface TodayProgressProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    pending: number
    blockers: number
  }
}

export function TodayProgress({ stats }: TodayProgressProps) {
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListTodo className="h-5 w-5 text-primary" />
          Today&apos;s Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <div>
              <p className="text-lg font-semibold text-success">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
            <Clock className="h-4 w-4 text-warning" />
            <div>
              <p className="text-lg font-semibold text-warning">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <ListTodo className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          {stats.blockers > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-lg font-semibold text-destructive">{stats.blockers}</p>
                <p className="text-xs text-muted-foreground">Blockers</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
