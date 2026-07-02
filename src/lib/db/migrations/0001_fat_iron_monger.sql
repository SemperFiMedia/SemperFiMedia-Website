CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_slug" text DEFAULT 'semper-fi-media' NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"service" text NOT NULL,
	"project_details" text,
	"tier_recommended" text,
	"page_path" text,
	"transcript" jsonb,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_client_created_idx" ON "leads" USING btree ("client_slug","created_at");