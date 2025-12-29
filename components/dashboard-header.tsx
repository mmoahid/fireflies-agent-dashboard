"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { SystemStatusInfo } from "@/lib/types"

interface DashboardHeaderProps {
  systemStatus: SystemStatusInfo
}

export function DashboardHeader({ systemStatus }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-success"
      case "disconnected":
        return "bg-muted-foreground"
      case "error":
        return "bg-destructive"
      default:
        return "bg-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Kam</h1>
        <p className="text-muted-foreground">
          {currentDate} {currentTime && `• ${currentTime}`}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getStatusVariant(systemStatus.fireflies)} className="gap-1.5">
          <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.fireflies)}`} />
          Fireflies.ai
        </Badge>
        <Badge variant={getStatusVariant(systemStatus.gemini)} className="gap-1.5">
          <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.gemini)}`} />
          Gemini
        </Badge>
        <Badge variant={getStatusVariant(systemStatus.agendaSystem)} className="gap-1.5">
          <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.agendaSystem)}`} />
          Agenda System
        </Badge>
      </div>
    </div>
  )
}
