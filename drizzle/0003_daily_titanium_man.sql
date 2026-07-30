CREATE TABLE "syllabi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"storage_key" text NOT NULL,
	"file_url" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"extracted_text" text,
	"ai_processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "syllabi" ADD CONSTRAINT "syllabi_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;