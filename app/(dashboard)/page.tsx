import { DashboardHeader } from "@/components/dashboard-header"
import { NextActionCard } from "@/components/next-action-card"
import { ActionButtons } from "@/components/action-buttons"
import { RecentContextFeed } from "@/components/recent-context-feed"
import { ObjectiveCard } from "@/components/objective-card"
import { TodayProgress } from "@/components/today-progress"
import { ControlPanel } from "@/components/control-panel"
import { fetchDashboardData, saveObjective } from "@/lib/actions"
import { getAgendaStats, getNextAction } from "@/lib/dashboard"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const { objective, agendaItems, recentMeetings, userProfile, userSettings, systemStatus } = await fetchDashboardData()

  const nextAction = getNextAction()
  const agendaStats = getAgendaStats(agendaItems)

  return (
    <div className="space-y-6">
      <DashboardHeader systemStatus={systemStatus} displayName={userProfile.displayName} />

      <ObjectiveCard objective={objective} onSave={saveObjective} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NextActionCard action={nextAction.action} time={nextAction.time} />
          <ActionButtons />
        </div>

        <div className="space-y-6">
          <TodayProgress stats={agendaStats} />
          <RecentContextFeed meetings={recentMeetings} />
          <ControlPanel settings={userSettings} />
        </div>
      </div>
    </div>
  )
}
