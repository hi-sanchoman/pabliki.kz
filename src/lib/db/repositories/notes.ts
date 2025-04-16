import { db } from '..';
import { notes, links } from '..';

import { eq, and, desc, sql } from 'drizzle-orm';

export const notesRepository = {
  // Get all notes for a link
  async getByLinkId(linkId: string) {
    return db.select().from(notes).where(eq(notes.linkId, linkId)).orderBy(desc(notes.updatedAt));
  },

  // Get all notes for a user
  async getAllByUserId(userId: string, limit = 20, offset = 0) {
    return db
      .select({
        note: notes,
        link: links,
      })
      .from(notes)
      .innerJoin(links, eq(notes.linkId, links.id))
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt))
      .limit(limit)
      .offset(offset);
  },

  // Get note by ID
  async getById(id: string) {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0] || null;
  },

  // Create a new note
  async create(data: { content: string; linkId: string; userId: string }) {
    const result = await db.insert(notes).values(data).returning();
    return result[0];
  },

  // Update a note
  async update(id: string, data: { content: string }) {
    const result = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return result[0];
  },

  // Delete a note
  async delete(id: string) {
    return db.delete(notes).where(eq(notes.id, id));
  },

  // Delete all notes for a link
  async deleteByLinkId(linkId: string) {
    return db.delete(notes).where(eq(notes.linkId, linkId));
  },

  // Check if a user has permission to modify a note
  async checkPermission(noteId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
    return result.length > 0;
  },

  // Search for notes by content
  async search(userId: string, query: string, limit = 20, offset = 0) {
    return db
      .select({
        note: notes,
        link: links,
      })
      .from(notes)
      .innerJoin(links, eq(notes.linkId, links.id))
      .where(and(eq(notes.userId, userId), sql`${notes.content} ILIKE ${`%${query}%`}`))
      .orderBy(desc(notes.updatedAt))
      .limit(limit)
      .offset(offset);
  },
};
