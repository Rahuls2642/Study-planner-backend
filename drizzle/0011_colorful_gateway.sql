ALTER TABLE "topics" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;