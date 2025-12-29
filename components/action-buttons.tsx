"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ActionButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Button asChild size="lg" className="h-16 gap-3 bg-warning text-warning-foreground hover:bg-warning/90">
        <Link href="/morning-sync">
          <Sun className="h-5 w-5" />
          <span className="text-lg font-medium">Morning Sync</span>
        </Link>
      </Button>
      <Button asChild size="lg" className="h-16 gap-3 bg-chart-4 text-foreground hover:bg-chart-4/90">
        <Link href="/afternoon-wrapup">
          <Moon className="h-5 w-5" />
          <span className="text-lg font-medium">Afternoon Wrap-Up</span>
        </Link>
      </Button>
    </div>
  )
}
