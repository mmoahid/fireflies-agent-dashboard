import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getAllMeetings } from "@/lib/actions"
import { SyncMeetingsButton } from "@/components/sync-meetings-button"
import {
  Video,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  LocateIcon as UpdateIcon,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MeetingsPage() {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-success text-success-foreground">Processed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "action_item":
        return <FileCheck className="h-3 w-3 text-primary" />
      case "decision":
        return <Lightbulb className="h-3 w-3 text-warning" />
      case "blocker":
        return <AlertTriangle className="h-3 w-3 text-destructive" />
      case "update":
        return <UpdateIcon className="h-3 w-3 text-muted-foreground" />
      case "follow_up":
        return <MessageSquare className="h-3 w-3 text-chart-4" />
      default:
        return null
    }
  }

  const meetings = await getAllMeetings()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meeting Log</h1>
          <p className="text-muted-foreground">All meetings captured by Fireflies.ai with extracted insights</p>
        </div>
        <SyncMeetingsButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            All Meetings
          </CardTitle>
          <CardDescription>Complete history of meetings with transcripts and AI-extracted insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Extracted Insights</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transcript</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(meeting.dateTime)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{meeting.title}</span>
                        {meeting.summary && (
                          <span className="text-xs text-muted-foreground line-clamp-1">{meeting.summary}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants.map((participant) => (
                          <Badge key={participant} variant="outline">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {meeting.extractedInsights.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {meeting.extractedInsights.slice(0, 2).map((insight) => (
                            <Badge key={insight.id} variant="secondary" className="gap-1 text-xs">
                              {getCategoryIcon(insight.category)}
                              <span className="line-clamp-1 max-w-[120px]">{insight.content}</span>
                            </Badge>
                          ))}
                          {meeting.extractedInsights.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{meeting.extractedInsights.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No insights</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                    <TableCell>
                      {meeting.transcriptUrl ? (
                        <a
                          href={meeting.transcriptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
