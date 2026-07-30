ALTER TABLE "syllabi" ADD COLUMN "bucket" text NOT NULL;--> statement-breakpoint
ALTER TABLE "syllabi" DROP COLUMN "file_url";