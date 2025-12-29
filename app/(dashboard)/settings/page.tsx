import { fetchSettingsData } from "@/lib/actions"
import { SettingsPageClient } from "@/components/settings-page-client"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const { userProfile, userSettings, systemStatus } = await fetchSettingsData()

  return <SettingsPageClient userProfile={userProfile} userSettings={userSettings} systemStatus={systemStatus} />
}

