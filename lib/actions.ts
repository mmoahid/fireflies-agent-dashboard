"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { AgendaStatus, Prisma } from "@prisma/client"
import { envCore } from "@/lib/env"
import { getSystemStatus } from "@/lib/system-status"
import { firefliesPing } from "@/lib/fireflies"

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

function toIso(date: Date) {
  return date.toISOString()
}

function serializeObjective(objective: { id: string; content: string; updatedAt: Date }) {
  return { id: objective.id, content: objective.content, updatedAt: toIso(objective.updatedAt) }
}

type AgendaItemRow = Prisma.AgendaItemGetPayload<Prisma.AgendaItemDefaultArgs>

function serializeAgendaItem(item: AgendaItemRow) {
  return {
    ...item,
    createdAt: toIso(item.createdAt),
    completedAt: item.completedAt ? toIso(item.completedAt) : null,
    dayDate: toIso(item.dayDate),
  }
}

export async function fetchDashboardData() {
  const today = todayDateOnly()

  const [objective, agendaItems, recentMeetings, userProfile, userSettings, systemStatus] = await Promise.all([
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
    prisma.userProfile.upsert({
      where: { key: "default" },
      create: { key: "default", displayName: envCore().DASHBOARD_USERNAME ?? "Owner" },
      update: {},
      select: { displayName: true },
    }),
    prisma.userSettings.upsert({
      where: { key: "default" },
      create: { key: "default" },
      update: {},
      select: { manualOverride: true, autoSync: true, notifications: true },
    }),
    Promise.resolve(getSystemStatus()),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return {
    objective: serializeObjective(ensuredObjective),
    agendaItems: agendaItems.map(serializeAgendaItem),
    recentMeetings,
    userProfile,
    userSettings,
    systemStatus,
  }
}

export async function fetchMorningSyncData() {
  const today = todayDateOnly()
  const yesterday = addDays(today, -1)

  const [objective, items, previousDayItems, userProfile, systemStatus] = await Promise.all([
    prisma.companyObjective.findUnique({ where: { key: "current" } }),
    prisma.agendaItem.findMany({
      where: { dayDate: today },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.agendaItem.findMany({
      where: { dayDate: yesterday },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.userProfile.upsert({
      where: { key: "default" },
      create: { key: "default", displayName: envCore().DASHBOARD_USERNAME ?? "Owner" },
      update: {},
      select: { displayName: true },
    }),
    Promise.resolve(getSystemStatus()),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return {
    objective: serializeObjective(ensuredObjective),
    items: items.map(serializeAgendaItem),
    previousDayItems: previousDayItems.map(serializeAgendaItem),
    userProfile,
    systemStatus,
  }
}

export async function fetchAfternoonWrapupData() {
  const today = todayDateOnly()

  const [objective, items, userProfile, systemStatus] = await Promise.all([
    prisma.companyObjective.findUnique({ where: { key: "current" } }),
    prisma.agendaItem.findMany({
      where: { dayDate: today },
      orderBy: [{ category: "asc" }, { priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.userProfile.upsert({
      where: { key: "default" },
      create: { key: "default", displayName: envCore().DASHBOARD_USERNAME ?? "Owner" },
      update: {},
      select: { displayName: true },
    }),
    Promise.resolve(getSystemStatus()),
  ])

  const ensuredObjective =
    objective ??
    (await prisma.companyObjective.create({
      data: {
        key: "current",
        content: "",
      },
    }))

  return { objective: serializeObjective(ensuredObjective), items: items.map(serializeAgendaItem), userProfile, systemStatus }
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
    select: { id: true, type: true, status: true },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return job
}

export async function queueFirefliesSync() {
  const job = await prisma.jobQueue.create({
    data: {
      type: "SYNC_FIREFLIES_ALL",
      status: "PENDING",
      payload: { requestedAt: new Date().toISOString(), requestedBy: "dashboard" },
    },
    select: { id: true, type: true, status: true },
  })

  revalidatePath("/")
  revalidatePath("/meetings")
  revalidatePath("/morning-sync")

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

export async function fetchSettingsData() {
  const [userProfile, userSettings, systemStatus] = await Promise.all([
    prisma.userProfile.upsert({
      where: { key: "default" },
      create: { key: "default", displayName: envCore().DASHBOARD_USERNAME ?? "Owner" },
      update: {},
      select: { displayName: true },
    }),
    prisma.userSettings.upsert({
      where: { key: "default" },
      create: { key: "default" },
      update: {},
      select: { manualOverride: true, autoSync: true, notifications: true },
    }),
    Promise.resolve(getSystemStatus()),
  ])

  return { userProfile, userSettings, systemStatus }
}

export async function updateUserSettings(patch: Partial<{ manualOverride: boolean; autoSync: boolean; notifications: boolean }>) {
  const updated = await prisma.userSettings.update({
    where: { key: "default" },
    data: patch,
    select: { manualOverride: true, autoSync: true, notifications: true },
  })

  revalidatePath("/")
  revalidatePath("/settings")

  return updated
}

export async function checkFirefliesConnection() {
  const user = await firefliesPing()
  return { ok: true as const, user }
}

export async function updateAgendaStatus(id: string, status: string) {
  if (!Object.values(AgendaStatus).includes(status as AgendaStatus)) {
    throw new Error(`Invalid agenda status: ${status}`)
  }

  const completedAt = status === "completed" ? new Date() : null

  const updated = await prisma.agendaItem.update({
    where: { id },
    data: { status: status as AgendaStatus, completedAt },
    select: { id: true, status: true, completedAt: true },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return { ...updated, completedAt: updated.completedAt ? toIso(updated.completedAt) : null }
}

export async function updateAgendaProgressNote(id: string, progressNote: string | null) {
  const updated = await prisma.agendaItem.update({
    where: { id },
    data: { progressNote },
    select: { id: true, progressNote: true },
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
    select: { id: true, content: true, updatedAt: true },
  })

  revalidatePath("/")
  revalidatePath("/morning-sync")
  revalidatePath("/afternoon-wrapup")

  return serializeObjective(updated)
}
