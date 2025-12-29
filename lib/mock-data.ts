import type {
  Meeting,
  AgendaItem,
  SystemLog,
  SystemStatusInfo,
  CompanyObjective,
  DailySync,
  ExtractedInsight,
} from "./types"

export const mockSystemStatus: SystemStatusInfo = {
  fireflies: "connected",
  gemini: "connected",
  agendaSystem: "connected",
}

export const mockObjective: CompanyObjective = {
  id: "obj-1",
  content:
    "Launch MVP of the AI productivity platform by Q1 2025, focusing on user acquisition and core feature stability.",
  updatedAt: new Date("2024-12-28T10:00:00"),
}

const meetingInsights: Record<string, ExtractedInsight[]> = {
  "1": [
    {
      id: "insight-1",
      content: "Need to finalize API documentation before developer preview",
      relevanceScore: 95,
      category: "action_item",
      meetingId: "1",
    },
    {
      id: "insight-2",
      content: "Decided to prioritize mobile responsiveness over desktop features",
      relevanceScore: 88,
      category: "decision",
      meetingId: "1",
    },
  ],
  "2": [
    {
      id: "insight-3",
      content: "Backend deployment blocked by AWS credential issue",
      relevanceScore: 92,
      category: "blocker",
      meetingId: "2",
    },
    {
      id: "insight-4",
      content: "Sprint velocity improved by 15% this week",
      relevanceScore: 75,
      category: "update",
      meetingId: "2",
    },
  ],
  "4": [
    {
      id: "insight-5",
      content: "Schedule investor demo for January 15th",
      relevanceScore: 90,
      category: "follow_up",
      meetingId: "4",
    },
    {
      id: "insight-6",
      content: "Allocate additional resources to onboarding flow",
      relevanceScore: 85,
      category: "action_item",
      meetingId: "4",
    },
  ],
}

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    firefliesMeetingId: "ff-001",
    title: "Weekly Product Sync",
    dateTime: new Date("2024-12-29T10:00:00"),
    participants: ["Kam", "Sarah Chen", "Mike Johnson"],
    kamParticipated: true,
    transcriptUrl: "https://fireflies.ai/transcript/001",
    summary: "Discussed Q1 roadmap priorities and resource allocation.",
    status: "processed",
    createdAt: new Date("2024-12-29T10:00:00"),
    updatedAt: new Date("2024-12-29T11:30:00"),
    extractedInsights: meetingInsights["1"] || [],
  },
  {
    id: "2",
    firefliesMeetingId: "ff-002",
    title: "Engineering Standup",
    dateTime: new Date("2024-12-28T09:30:00"),
    participants: ["Alex Rivera", "Jordan Lee", "Kam"],
    kamParticipated: true,
    transcriptUrl: "https://fireflies.ai/transcript/002",
    summary: "Sprint progress review and blocker discussion.",
    status: "processed",
    createdAt: new Date("2024-12-28T09:30:00"),
    updatedAt: new Date("2024-12-28T10:00:00"),
    extractedInsights: meetingInsights["2"] || [],
  },
  {
    id: "3",
    firefliesMeetingId: "ff-003",
    title: "Client Presentation Review",
    dateTime: new Date("2024-12-27T14:00:00"),
    participants: ["Emily Watson", "David Kim"],
    kamParticipated: false,
    transcriptUrl: "https://fireflies.ai/transcript/003",
    summary: "Finalized deck for upcoming client pitch.",
    status: "processed",
    createdAt: new Date("2024-12-27T14:00:00"),
    updatedAt: new Date("2024-12-27T15:30:00"),
    extractedInsights: [],
  },
  {
    id: "4",
    firefliesMeetingId: "ff-004",
    title: "Strategy Planning Session",
    dateTime: new Date("2024-12-27T11:00:00"),
    participants: ["Kam", "Lisa Park", "Tom Brown"],
    kamParticipated: true,
    transcriptUrl: "https://fireflies.ai/transcript/004",
    summary: "Outlined key initiatives for next quarter.",
    status: "processed",
    createdAt: new Date("2024-12-27T11:00:00"),
    updatedAt: new Date("2024-12-27T12:30:00"),
    extractedInsights: meetingInsights["4"] || [],
  },
  {
    id: "5",
    firefliesMeetingId: "ff-005",
    title: "Budget Review",
    dateTime: new Date("2024-12-26T15:00:00"),
    participants: ["Finance Team", "Kam"],
    kamParticipated: true,
    transcriptUrl: null,
    summary: null,
    status: "pending",
    createdAt: new Date("2024-12-26T15:00:00"),
    updatedAt: new Date("2024-12-26T15:00:00"),
    extractedInsights: [],
  },
]

export const mockAgendaItems: AgendaItem[] = [
  {
    id: "agenda-1",
    content: "Finalize API documentation before developer preview",
    status: "in_progress",
    priority: "high",
    sourceMeetingId: "1",
    sourceMeetingTitle: "Weekly Product Sync",
    category: "action_item",
    progressNote: "Draft completed, pending review",
    createdAt: new Date("2024-12-29T08:00:00"),
    completedAt: null,
    dayDate: new Date("2024-12-29"),
  },
  {
    id: "agenda-2",
    content: "Resolve AWS credential issue blocking backend deployment",
    status: "pending",
    priority: "high",
    sourceMeetingId: "2",
    sourceMeetingTitle: "Engineering Standup",
    category: "blocker",
    progressNote: null,
    createdAt: new Date("2024-12-29T08:00:00"),
    completedAt: null,
    dayDate: new Date("2024-12-29"),
  },
  {
    id: "agenda-3",
    content: "Schedule investor demo for January 15th",
    status: "completed",
    priority: "medium",
    sourceMeetingId: "4",
    sourceMeetingTitle: "Strategy Planning Session",
    category: "follow_up",
    progressNote: "Calendar invite sent to all stakeholders",
    createdAt: new Date("2024-12-29T08:00:00"),
    completedAt: new Date("2024-12-29T14:30:00"),
    dayDate: new Date("2024-12-29"),
  },
  {
    id: "agenda-4",
    content: "Allocate additional resources to onboarding flow",
    status: "pending",
    priority: "medium",
    sourceMeetingId: "4",
    sourceMeetingTitle: "Strategy Planning Session",
    category: "action_item",
    progressNote: null,
    createdAt: new Date("2024-12-29T08:00:00"),
    completedAt: null,
    dayDate: new Date("2024-12-29"),
  },
  {
    id: "agenda-5",
    content: "Review mobile responsiveness implementation plan",
    status: "pending",
    priority: "low",
    sourceMeetingId: "1",
    sourceMeetingTitle: "Weekly Product Sync",
    category: "decision",
    progressNote: null,
    createdAt: new Date("2024-12-29T08:00:00"),
    completedAt: null,
    dayDate: new Date("2024-12-29"),
  },
]

export const mockPreviousDayItems: AgendaItem[] = [
  {
    id: "prev-1",
    content: "Complete user authentication flow testing",
    status: "completed",
    priority: "high",
    sourceMeetingId: "2",
    sourceMeetingTitle: "Engineering Standup",
    category: "action_item",
    progressNote: "All tests passing, merged to main",
    createdAt: new Date("2024-12-28T08:00:00"),
    completedAt: new Date("2024-12-28T16:00:00"),
    dayDate: new Date("2024-12-28"),
  },
  {
    id: "prev-2",
    content: "Set up staging environment for QA",
    status: "carried_over",
    priority: "medium",
    sourceMeetingId: "2",
    sourceMeetingTitle: "Engineering Standup",
    category: "action_item",
    progressNote: "Blocked by infrastructure team availability",
    createdAt: new Date("2024-12-28T08:00:00"),
    completedAt: null,
    dayDate: new Date("2024-12-28"),
  },
]

export const mockDailySync: DailySync = {
  id: "sync-1",
  date: new Date("2024-12-29"),
  morningAgendaItems: mockAgendaItems,
  afternoonStatus: "not_started",
  morningNotes: null,
  afternoonNotes: null,
}

export const mockSystemLogs: SystemLog[] = [
  {
    id: "1",
    action: "FETCH_MEETINGS",
    status: "success",
    message: "Successfully fetched 5 meetings from Fireflies.",
    createdAt: new Date("2024-12-29T08:00:00"),
  },
  {
    id: "2",
    action: "EXTRACT_INSIGHTS",
    status: "success",
    message: "AI extracted 6 relevant insights from meetings.",
    createdAt: new Date("2024-12-29T08:05:00"),
  },
  {
    id: "3",
    action: "GENERATE_AGENDA",
    status: "success",
    message: "Morning sync agenda generated with 5 items.",
    createdAt: new Date("2024-12-29T08:06:00"),
  },
]

export function getNextAction(): { action: string; time: string } {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 9) {
    return { action: "Morning Sync", time: "9:00 AM" }
  } else if (hour < 12) {
    return { action: "Review Meeting Notes", time: "12:00 PM" }
  } else if (hour < 17) {
    return { action: "Afternoon Wrap-Up", time: "5:00 PM" }
  } else {
    return { action: "Morning Sync", time: "Tomorrow 9:00 AM" }
  }
}

export function getRecentMeetingsWithKam(): Meeting[] {
  return mockMeetings.filter((m) => m.kamParticipated).slice(0, 3)
}

export function getAgendaStats() {
  const total = mockAgendaItems.length
  const completed = mockAgendaItems.filter((i) => i.status === "completed").length
  const inProgress = mockAgendaItems.filter((i) => i.status === "in_progress").length
  const pending = mockAgendaItems.filter((i) => i.status === "pending").length
  const blockers = mockAgendaItems.filter((i) => i.category === "blocker").length

  return { total, completed, inProgress, pending, blockers }
}
