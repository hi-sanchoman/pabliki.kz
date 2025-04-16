-- Create enum for action types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action_type') THEN
        CREATE TYPE "action_type" AS ENUM (
            'save_link', 
            'delete_link', 
            'update_link', 
            'add_tag', 
            'remove_tag', 
            'create_collection', 
            'add_to_collection', 
            'search',
            'visit_link'
        );
    END IF;
END $$;
--> statement-breakpoint

-- Drop existing tables from previous schema that are being replaced
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "likes" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
--> statement-breakpoint

-- Links table - core of the bookmarking system
CREATE TABLE "links" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "url" text NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "content" text,
    "image" text,
    "favicon" text,
    "site_name" text,
    "is_archived" boolean DEFAULT false,
    "is_favorite" boolean DEFAULT false,
    "reading_time" integer,
    "last_visited" timestamp,
    "user_id" uuid NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Tags table - for both manual and AI-generated tags
CREATE TABLE "tags" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(100) NOT NULL,
    "color" varchar(7),
    "is_ai_generated" boolean DEFAULT false,
    "user_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Collections table (folders for organizing links)
CREATE TABLE "collections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(100) NOT NULL,
    "description" text,
    "color" varchar(7),
    "icon" text,
    "is_private" boolean DEFAULT true,
    "user_id" uuid NOT NULL,
    "parent_id" uuid,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Links to Tags many-to-many relationship
CREATE TABLE "links_tags" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "link_id" uuid NOT NULL,
    "tag_id" uuid NOT NULL,
    "confidence" numeric(4, 2),
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Links to Collections many-to-many relationship
CREATE TABLE "link_collections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "link_id" uuid NOT NULL,
    "collection_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Notes table for user annotations on links
CREATE TABLE "notes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "content" text NOT NULL,
    "link_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Search history to improve search functionality
CREATE TABLE "search_history" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "query" text NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- View preferences for UI customization
CREATE TABLE "view_preferences" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "view_mode" varchar(20) DEFAULT 'grid',
    "sort_by" varchar(20) DEFAULT 'created_at',
    "sort_direction" varchar(4) DEFAULT 'desc',
    "theme" varchar(10) DEFAULT 'light',
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "view_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint

-- Activity log for analytics and history
CREATE TABLE "activity_log" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "action_type" action_type NOT NULL,
    "entity_id" uuid,
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Add foreign key constraints
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_parent_id_collections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "links_tags" ADD CONSTRAINT "links_tags_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "links_tags" ADD CONSTRAINT "links_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "link_collections" ADD CONSTRAINT "link_collections_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "link_collections" ADD CONSTRAINT "link_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "view_preferences" ADD CONSTRAINT "view_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Add indexes for performance
CREATE INDEX "links_user_id_idx" ON "links" ("user_id");
CREATE INDEX "links_url_idx" ON "links" ("url");
CREATE INDEX "tags_user_id_idx" ON "tags" ("user_id");
CREATE INDEX "tags_name_idx" ON "tags" ("name");
CREATE INDEX "collections_user_id_idx" ON "collections" ("user_id");
CREATE INDEX "collections_parent_id_idx" ON "collections" ("parent_id");
CREATE INDEX "links_tags_link_id_idx" ON "links_tags" ("link_id");
CREATE INDEX "links_tags_tag_id_idx" ON "links_tags" ("tag_id");
CREATE INDEX "link_collections_link_id_idx" ON "link_collections" ("link_id");
CREATE INDEX "link_collections_collection_id_idx" ON "link_collections" ("collection_id");
CREATE INDEX "notes_link_id_idx" ON "notes" ("link_id");
CREATE INDEX "notes_user_id_idx" ON "notes" ("user_id");
CREATE INDEX "search_history_user_id_idx" ON "search_history" ("user_id");
CREATE INDEX "activity_log_user_id_idx" ON "activity_log" ("user_id");
CREATE INDEX "activity_log_entity_id_idx" ON "activity_log" ("entity_id"); 