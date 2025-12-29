-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('pending', 'processed', 'error');

-- CreateEnum
CREATE TYPE "InsightCategory" AS ENUM ('action_item', 'decision', 'blocker', 'update', 'follow_up');

-- CreateEnum
CREATE TYPE "AgendaStatus" AS ENUM ('pending', 'in_progress', 'completed', 'carried_over');

-- CreateEnum
CREATE TYPE "AgendaPriority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "AfternoonStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "SystemLogStatus" AS ENUM ('success', 'error', 'pending');

-- CreateTable
CREATE TABLE "meetings" (
    "id" UUID NOT NULL,
    "fireflies_meeting_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "participants" TEXT[],
    "kam_participated" BOOLEAN NOT NULL,
    "transcript_url" TEXT,
    "summary" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracted_insights" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "relevance_score" INTEGER NOT NULL,
    "category" "InsightCategory" NOT NULL,
    "meeting_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extracted_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_items" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "status" "AgendaStatus" NOT NULL DEFAULT 'pending',
    "priority" "AgendaPriority" NOT NULL DEFAULT 'medium',
    "source_meeting_id" UUID,
    "source_meeting_title" TEXT,
    "category" "InsightCategory" NOT NULL,
    "progress_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "day_date" DATE NOT NULL,
    "daily_sync_id" UUID,

    CONSTRAINT "agenda_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_syncs" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "afternoon_status" "AfternoonStatus" NOT NULL DEFAULT 'not_started',
    "morning_notes" TEXT,
    "afternoon_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_objectives" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "status" "SystemLogStatus" NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_queue" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meetings_fireflies_meeting_id_key" ON "meetings"("fireflies_meeting_id");

-- CreateIndex
CREATE INDEX "extracted_insights_meeting_id_idx" ON "extracted_insights"("meeting_id");

-- CreateIndex
CREATE INDEX "agenda_items_day_date_idx" ON "agenda_items"("day_date");

-- CreateIndex
CREATE INDEX "agenda_items_source_meeting_id_idx" ON "agenda_items"("source_meeting_id");

-- CreateIndex
CREATE INDEX "agenda_items_daily_sync_id_idx" ON "agenda_items"("daily_sync_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_syncs_date_key" ON "daily_syncs"("date");

-- CreateIndex
CREATE UNIQUE INDEX "company_objectives_key_key" ON "company_objectives"("key");

-- CreateIndex
CREATE INDEX "job_queue_status_created_at_idx" ON "job_queue"("status", "created_at");

-- AddForeignKey
ALTER TABLE "extracted_insights" ADD CONSTRAINT "extracted_insights_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_items" ADD CONSTRAINT "agenda_items_source_meeting_id_fkey" FOREIGN KEY ("source_meeting_id") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_items" ADD CONSTRAINT "agenda_items_daily_sync_id_fkey" FOREIGN KEY ("daily_sync_id") REFERENCES "daily_syncs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
