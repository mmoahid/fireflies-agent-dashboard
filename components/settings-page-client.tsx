"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Bot, CheckCircle, FileText, Link2, RefreshCw, Settings } from "lucide-react"
import type { SystemStatusInfo } from "@/lib/types"
import { checkFirefliesConnection, queueFirefliesSync, triggerSync, updateUserSettings } from "@/lib/actions"

interface SettingsPageClientProps {
  userProfile: { displayName: string }
  userSettings: { manualOverride: boolean; autoSync: boolean; notifications: boolean }
  systemStatus: SystemStatusInfo
}

export function SettingsPageClient({ userProfile, userSettings, systemStatus }: SettingsPageClientProps) {
  const [manualOverride, setManualOverride] = useState(userSettings.manualOverride)
  const [autoSync, setAutoSync] = useState(userSettings.autoSync)
  const [notifications, setNotifications] = useState(userSettings.notifications)
  const [isPending, startTransition] = useTransition()

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

  const persist = (patch: Partial<{ manualOverride: boolean; autoSync: boolean; notifications: boolean }>) => {
    startTransition(async () => {
      try {
        await updateUserSettings(patch)
        toast.success("Settings saved")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save settings"
        toast.error("Could not save settings", { description: message })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Shared workspace configuration for {userProfile.displayName}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Integration Status
            </CardTitle>
            <CardDescription>Connected services and their current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Bot className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">Fireflies.ai</p>
                  <p className="text-xs text-muted-foreground">Meeting transcription service</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.fireflies)}`} />
                {systemStatus.fireflies}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Bot className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">Google Gemini</p>
                  <p className="text-xs text-muted-foreground">Reasoning engine</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.gemini)}`} />
                {systemStatus.gemini}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">Agenda System</p>
                  <p className="text-xs text-muted-foreground">Database-backed agenda + job queue</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus.agendaSystem)}`} />
                {systemStatus.agendaSystem}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Preferences
            </CardTitle>
            <CardDescription>Control how the automation behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="manual-override" className="text-sm font-medium">
                  Manual Override
                </Label>
                <p className="text-xs text-muted-foreground">Disable automatic agenda generation</p>
              </div>
              <Switch
                id="manual-override"
                checked={manualOverride}
                disabled={isPending}
                onCheckedChange={(v) => {
                  setManualOverride(v)
                  persist({ manualOverride: v })
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync" className="text-sm font-medium">
                  Auto Sync
                </Label>
                <p className="text-xs text-muted-foreground">Automatically sync meetings from Fireflies</p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                disabled={isPending}
                onCheckedChange={(v) => {
                  setAutoSync(v)
                  persist({ autoSync: v })
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Notify when agendas are ready (coming soon)</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                disabled={isPending}
                onCheckedChange={(v) => {
                  setNotifications(v)
                  persist({ notifications: v })
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Manual operations and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start gap-2 bg-transparent"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const job = await queueFirefliesSync()
                  toast.success("Meeting sync queued", { description: `${job.type} (${job.status})` })
                })
              }
            >
              <RefreshCw className="h-4 w-4" />
              Force Sync Meetings
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-2 bg-transparent"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const job = await triggerSync("morning")
                  toast.success("Job queued", { description: `${job.type} (${job.status})` })
                })
              }
            >
              <RefreshCw className="h-4 w-4" />
              Queue Morning Sync
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-2 bg-transparent"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    const res = await checkFirefliesConnection()
                    toast.success("Fireflies OK", { description: res.user.email })
                  } catch (err) {
                    const message = err instanceof Error ? err.message : "Fireflies check failed"
                    toast.error("Fireflies Error", { description: message })
                  }
                })
              }
            >
              <CheckCircle className="h-4 w-4" />
              Test Fireflies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
