"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowRight } from "lucide-react"

interface NextActionCardProps {
  action: string
  time: string
}

export function NextActionCard({ action, time }: NextActionCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="h-4 w-4" />
          Predicted Next Action
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-foreground">{action}</p>
            <p className="text-sm text-muted-foreground">Scheduled for {time}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
