"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, RefreshCw } from "lucide-react"

export function ControlPanel() {
  const [manualOverride, setManualOverride] = useState(false)

  const handleBigBang = () => {
    console.log("Big Bang Initialization triggered")
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
        <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleBigBang}>
          <RefreshCw className="h-4 w-4" />
          Big Bang Initialization
        </Button>
      </CardContent>
    </Card>
  )
}
