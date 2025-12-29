import { fetchMorningSyncData } from "@/lib/actions"
import { MorningSyncPageClient } from "@/components/morning-sync-page-client"

export const dynamic = "force-dynamic"

export default async function MorningSyncPage() {
  const { objective, items, previousDayItems } = await fetchMorningSyncData()

  return <MorningSyncPageClient objective={objective} items={items} previousDayItems={previousDayItems} />
}
