"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Meeting } from "@/lib/types"
import { Video } from "lucide-react"

interface MeetingsTableProps {
  meetings: Meeting[]
}

export function MeetingsTable({ meetings }: MeetingsTableProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-5 w-5 text-primary" />
          Recent Meetings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.slice(0, 5).map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(meeting.dateTime)}
                  </TableCell>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {meeting.participants.map((participant) => (
                        <Badge
                          key={participant}
                          variant={participant === "Kam" ? "default" : "outline"}
                          className={participant === "Kam" ? "bg-primary text-primary-foreground" : ""}
                        >
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
