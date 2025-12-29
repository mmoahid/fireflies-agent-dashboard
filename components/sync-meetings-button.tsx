"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { queueFirefliesSync } from "@/lib/actions"

export function SyncMeetingsButton() {
  const [isPending, startTransition] = useTransition()

  return (
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
            const message = err instanceof Error ? err.message : "Failed to queue meeting sync"
            toast.error("Could not queue meeting sync", { description: message })
          }
        })
      }
    >
      <RefreshCw className="h-4 w-4" />
      Sync Meetings
    </Button>
  )
}

