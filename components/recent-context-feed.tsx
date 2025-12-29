import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Meeting } from "@/lib/types"
import { Users, Calendar } from "lucide-react"

interface RecentContextFeedProps {
  meetings: Meeting[]
}

export function RecentContextFeed({ meetings }: RecentContextFeedProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Recent Context Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-4">
              {/* Header row: badge and date inline */}
              <div className="flex items-center justify-between gap-2">
                {meeting.kamParticipated ? (
                  <Badge variant="outline" className="border-primary text-primary shrink-0">
                    Owner Present
                  </Badge>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(meeting.dateTime)} · {formatTime(meeting.dateTime)}
                  </span>
                </div>
              </div>

              {/* Title - full width, no breaking */}
              <h4 className="font-medium text-foreground">{meeting.title}</h4>

              {/* Summary */}
              {meeting.summary && <p className="text-sm text-muted-foreground">{meeting.summary}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
