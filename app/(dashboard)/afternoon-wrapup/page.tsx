import { fetchAfternoonWrapupData } from "@/lib/actions"
import { AfternoonWrapupPageClient } from "@/components/afternoon-wrapup-page-client"

export const dynamic = "force-dynamic"

export default async function AfternoonWrapUpPage() {
  const { objective, items } = await fetchAfternoonWrapupData()

  return <AfternoonWrapupPageClient objective={objective} items={items} />
}
