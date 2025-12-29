"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { AgendaStatus } from "@prisma/client"

function todayDateOnly() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function fetchDashboardData() {
  const today = todayDateOnly()

  const [objective, agendaItems, recentMeetings] = await Promise.all([
    prisma.companyObjective.findUnique({ where: { key: "current" } }),
    prisma.agendaItem.findMany({
      where: { dayDate: today },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.meeting.findMany({
      where: { kamParticipated: true },
      orderBy: { dateTime: "desc" },
      take: 3,
      include: { extractedInsights: true },
    }),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return { objective: ensuredObjective, agendaItems, recentMeetings }
}

export async function fetchMorningSyncData() {
  const today = todayDateOnly()
  const yesterday = addDays(today, -1)

  const [objective, items, previousDayItems] = await Promise.all([
    prisma.companyObjective.findUnique({ where: { key: "current" } }),
    prisma.agendaItem.findMany({
      where: { dayDate: today },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.agendaItem.findMany({
      where: { dayDate: yesterday },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return { objective: ensuredObjective, items, previousDayItems }
}

export async function fetchAfternoonWrapupData() {
  const today = todayDateOnly()

  const [objective, items] = await Promise.all([
    prisma.companyObjective.findUnique({ where: { key: "current" } }),
    prisma.agendaItem.findMany({
      where: { dayDate: today },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return { objective: ensuredObjective, items }
}

export async function triggerSync(type: "morning" | "afternoon") {
  const jobType = type === "morning" ? "RUN_MORNING_SYNC" : "RUN_AFTERNOON_SYNC"

  const job = await prisma.jobQueue.create({
    data: {
      type: jobType,
      status: "PENDING",
      payload: {
        requestedAt: new Date().toISOString(),
        requestedBy: "dashboard",
      },
    },
    select: { id: true, type: true, status: true, createdAt: true },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return job
}

export async function getRecentMeetings() {
  return prisma.meeting.findMany({
    orderBy: { dateTime: "desc" },
    take: 5,
    include: { extractedInsights: true },
  })
}

export async function getAllMeetings() {
  return prisma.meeting.findMany({
    orderBy: { dateTime: "desc" },
    include: { extractedInsights: true },
  })
}

export async function updateAgendaStatus(id: string, status: string) {
  if (!Object.values(AgendaStatus).includes(status as AgendaStatus)) {
    throw new Error(`Invalid agenda status: ${status}`)
  }

  const completedAt = status === "completed" ? new Date() : null

  const updated = await prisma.agendaItem.update({
    where: { id },
    data: { status: status as AgendaStatus, completedAt },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return updated
}

export async function updateAgendaProgressNote(id: string, progressNote: string | null) {
  const updated = await prisma.agendaItem.update({
    where: { id },
    data: { progressNote },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return updated
}

export async function saveObjective(text: string) {
  const updated = await prisma.companyObjective.upsert({
    where: { key: "current" },
    create: { key: "current", content: text },
    update: { content: text },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return updated
}
