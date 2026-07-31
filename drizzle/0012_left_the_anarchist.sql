ALTER TABLE "study_plans" ADD COLUMN "part" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "study_plans" ADD COLUMN "total_parts" integer DEFAULT 1 NOT NULL;