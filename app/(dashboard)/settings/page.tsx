"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Link2, Bot, FileText, RefreshCw, Save, CheckCircle } from "lucide-react"
import { mockSystemStatus } from "@/lib/mock-data"

export default function SettingsPage() {
  const [manualOverride, setManualOverride] = useState(false)
  const [autoSync, setAutoSync] = useState(true)
  const [notifications, setNotifications] = useState(true)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your AI Chief of Staff preferences</p>
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
                <span className={`h-2 w-2 rounded-full ${getStatusColor(mockSystemStatus.fireflies)}`} />
                {mockSystemStatus.fireflies}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Bot className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">Google Gemini</p>
                  <p className="text-xs text-muted-foreground">AI processing engine</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(mockSystemStatus.gemini)}`} />
                {mockSystemStatus.gemini}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">Google Docs</p>
                  <p className="text-xs text-muted-foreground">Document storage</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(mockSystemStatus.googleDocs)}`} />
                {mockSystemStatus.googleDocs}
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
            <CardDescription>Customize how your AI assistant behaves</CardDescription>
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

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync" className="text-sm font-medium">
                  Auto Sync
                </Label>
                <p className="text-xs text-muted-foreground">Automatically sync meetings from Fireflies</p>
              </div>
              <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Get notified when agendas are ready</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage your API keys and endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fireflies-key">Fireflies API Key</Label>
              <Input id="fireflies-key" type="password" placeholder="ff_••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <Input id="gemini-key" type="password" placeholder="AIza••••••••••••••••" />
            </div>
            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Manual system operations and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Big Bang Initialization
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Force Sync All Meetings
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <CheckCircle className="h-4 w-4" />
              Test All Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
