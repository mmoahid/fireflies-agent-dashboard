import { DashboardHeader } from "@/components/dashboard-header"
import { NextActionCard } from "@/components/next-action-card"
import { ActionButtons } from "@/components/action-buttons"
import { RecentContextFeed } from "@/components/recent-context-feed"
import { ObjectiveCard } from "@/components/objective-card"
import { TodayProgress } from "@/components/today-progress"
import { ControlPanel } from "@/components/control-panel"
import {
  mockSystemStatus,
  mockObjective,
  getNextAction,
  getRecentMeetingsWithKam,
  getAgendaStats,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const nextAction = getNextAction()
  const recentKamMeetings = getRecentMeetingsWithKam()
  const agendaStats = getAgendaStats()

  return (
    <div className="space-y-6">
      <DashboardHeader systemStatus={mockSystemStatus} />

      <ObjectiveCard objective={mockObjective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NextActionCard action={nextAction.action} time={nextAction.time} />
          <ActionButtons />
        </div>

        <div className="space-y-6">
          <TodayProgress stats={agendaStats} />
          <RecentContextFeed meetings={recentKamMeetings} />
          <ControlPanel />
        </div>
      </div>
    </div>
  )
}
