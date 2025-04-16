import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
  pgEnum,
  jsonb,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Re-export auth tables
export * from './auth-schema';

// Links table - core of the bookmarking system
export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'), // For storing extracted page content
  image: text('image'), // Thumbnail or preview image URL
  favicon: text('favicon'), // Site favicon
  siteName: text('site_name'), // Website name
  isArchived: boolean('is_archived').default(false), // For saved/archived state
  isFavorite: boolean('is_favorite').default(false), // For favorited links
  readingTime: integer('reading_time'), // Estimated reading time in minutes
  lastVisited: timestamp('last_visited'),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  metadata: jsonb('metadata'), // For storing additional extracted metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tags table - for both manual and AI-generated tags
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }),
  isAiGenerated: boolean('is_ai_generated').default(false),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// First declare the collections table without self-reference
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }),
  icon: text('icon'),
  isPrivate: boolean('is_private').default(true),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  parentId: uuid('parent_id'), // Will be added as reference in relations
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define the collection model type for use in relations
export type Collection = InferSelectModel<typeof collections>;

// Links to Tags many-to-many relationship
export const linksTags = pgTable('links_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  linkId: uuid('link_id')
    .references(() => links.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  confidence: numeric('confidence', { precision: 4, scale: 2 }), // AI confidence score for auto-tagged items
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Links to Collections many-to-many relationship
export const linkCollections = pgTable('link_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  linkId: uuid('link_id')
    .references(() => links.id, { onDelete: 'cascade' })
    .notNull(),
  collectionId: uuid('collection_id')
    .references(() => collections.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notes table for user annotations on links
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  linkId: uuid('link_id')
    .references(() => links.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Search history to improve search functionality
export const searchHistory = pgTable('search_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  query: text('query').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// View preferences for UI customization
export const viewPreferences = pgTable('view_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  viewMode: varchar('view_mode', { length: 20 }).default('grid'), // grid, list, compact
  sortBy: varchar('sort_by', { length: 20 }).default('created_at'),
  sortDirection: varchar('sort_direction', { length: 4 }).default('desc'), // asc or desc
  theme: varchar('theme', { length: 10 }).default('light'), // light, dark, system
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enum for tracking events
export const actionTypeEnum = pgEnum('action_type', [
  'save_link',
  'delete_link',
  'update_link',
  'add_tag',
  'remove_tag',
  'create_collection',
  'add_to_collection',
  'search',
  'visit_link',
]);

// Activity log for analytics and history
export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  actionType: actionTypeEnum('action_type').notNull(),
  entityId: uuid('entity_id'), // ID of the entity being acted upon (link, tag, etc.)
  metadata: jsonb('metadata'), // Additional data about the action
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations after all tables are defined to avoid circular references
// Define user relations
export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
  collections: many(collections),
  tags: many(tags),
}));

// Define link relations
export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  tags: many(linksTags),
  collections: many(linkCollections),
  notes: many(notes),
}));

// Tags relations
export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  links: many(linksTags),
}));

// Links Tags relations
export const linksTagsRelations = relations(linksTags, ({ one }) => ({
  link: one(links, {
    fields: [linksTags.linkId],
    references: [links.id],
  }),
  tag: one(tags, {
    fields: [linksTags.tagId],
    references: [tags.id],
  }),
}));

// Collections relations with self-reference
export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  parent: one(collections, {
    fields: [collections.parentId],
    references: [collections.id],
    relationName: 'parent_child',
  }),
  children: many(collections, {
    relationName: 'parent_child',
  }),
  links: many(linkCollections),
}));

// Link Collections relations
export const linkCollectionsRelations = relations(linkCollections, ({ one }) => ({
  link: one(links, {
    fields: [linkCollections.linkId],
    references: [links.id],
  }),
  collection: one(collections, {
    fields: [linkCollections.collectionId],
    references: [collections.id],
  }),
}));

// Notes relations
export const notesRelations = relations(notes, ({ one }) => ({
  link: one(links, {
    fields: [notes.linkId],
    references: [links.id],
  }),
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
