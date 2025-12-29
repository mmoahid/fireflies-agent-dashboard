"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Target, Pencil, Check, X } from "lucide-react"
import type { CompanyObjective } from "@/lib/types"
import { toast } from "sonner"

interface ObjectiveCardProps {
  objective: CompanyObjective
  onSave?: (content: string) => unknown | Promise<unknown>
}

export function ObjectiveCard({ objective, onSave }: ObjectiveCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(objective.content)
  const [isSaving, startTransition] = useTransition()

  const handleSave = () => {
    if (!onSave) {
      setIsEditing(false)
      return
    }

    startTransition(async () => {
      try {
        await onSave(content)
        toast.success("Objective saved")
        setIsEditing(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save objective"
        toast.error("Could not save objective", { description: message })
      }
    })
  }

  const handleCancel = () => {
    setContent(objective.content)
    setIsEditing(false)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Company Objective
          </CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none bg-background"
              placeholder="Enter your company objective..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="gap-1.5" disabled={isSaving}>
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="gap-1.5 bg-transparent"
                disabled={isSaving}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-foreground">{objective.content}</p>
            <p className="text-xs text-muted-foreground">Last updated: {formatDate(objective.updatedAt)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
