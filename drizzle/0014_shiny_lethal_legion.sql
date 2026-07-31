ALTER TYPE "public"."study_plan_status" ADD VALUE 'IN_PROGRESS' BEFORE 'COMPLETED';--> statement-breakpoint
ALTER TABLE "study_plans" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "study_plans" ADD COLUMN "completed_at" timestamp;