import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    const [meetings, agendaItems, objectives, profiles, settings] = await Promise.all([
      prisma.meeting.count(),
      prisma.agendaItem.count(),
      prisma.companyObjective.count(),
      prisma.userProfile.count(),
      prisma.userSettings.count(),
    ])

    return NextResponse.json({
      ok: true,
      counts: { meetings, agendaItems, objectives, profiles, settings },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: { message } }, { status: 500 })
  }
}

