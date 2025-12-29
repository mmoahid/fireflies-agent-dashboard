"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { triggerSync } from "@/lib/actions"

export function ControlPanel() {
  const [manualOverride, setManualOverride] = useState(false)
  const [isPending, startTransition] = useTransition()

  const queueSync = (type: "morning" | "afternoon") => {
    startTransition(async () => {
      try {
        const job = await triggerSync(type)
        toast.success("Job queued", { description: `${job.type} (${job.status})` })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to queue job"
        toast.error("Could not queue job", { description: message })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="manual-override" className="text-sm font-medium">
              Manual Override
            </Label>
            <p className="text-xs text-muted-foreground">Disable automatic agenda generation</p>
          </div>
          <Switch id="manual-override" checked={manualOverride} onCheckedChange={setManualOverride} />
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent"
          onClick={() => queueSync("morning")}
          disabled={isPending}
        >
          <RefreshCw className="h-4 w-4" />
          Big Bang Initialization
        </Button>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" className="w-full" onClick={() => queueSync("morning")} disabled={isPending}>
            Queue Morning Sync
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => queueSync("afternoon")} disabled={isPending}>
            Queue Afternoon Wrap-Up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
