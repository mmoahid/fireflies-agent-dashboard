import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    const prismaDelegates = prisma as unknown as Record<string, { count: () => Promise<number> } | undefined>
    const delegateNames = ["meeting", "agendaItem", "companyObjective", "userProfile", "userSettings"] as const

    const available = Object.fromEntries(delegateNames.map((name) => [name, Boolean(prismaDelegates[name])]))

    const countsEntries = await Promise.all(
      delegateNames.map(async (name) => {
        const delegate = prismaDelegates[name]
        if (!delegate) return [name, null] as const
        return [name, await delegate.count()] as const
      }),
    )

    const counts = Object.fromEntries(countsEntries)

    return NextResponse.json({
      ok: true,
      available,
      counts,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: { message } }, { status: 500 })
  }
}
