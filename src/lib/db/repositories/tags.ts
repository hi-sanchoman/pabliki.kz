import { db } from '..';
import { tags, linksTags, links } from '..';

import { eq, and, like, count, desc, asc } from 'drizzle-orm';

export const tagsRepository = {
  // Get all tags for a user
  async getAllByUserId(userId: string) {
    return db.select().from(tags).where(eq(tags.userId, userId)).orderBy(asc(tags.name));
  },

  // Get tag by ID
  async getById(id: string) {
    const result = await db.select().from(tags).where(eq(tags.id, id));
    return result[0] || null;
  },

  // Get tag by name for a specific user
  async getByName(name: string, userId: string) {
    const result = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name), eq(tags.userId, userId)));
    return result[0] || null;
  },

  // Create a new tag
  async create(data: { name: string; userId: string; color?: string; isAiGenerated?: boolean }) {
    const result = await db.insert(tags).values(data).returning();
    return result[0];
  },

  // Update a tag
  async update(id: string, data: Partial<typeof tags.$inferInsert>) {
    const result = await db
      .update(tags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();
    return result[0];
  },

  // Delete a tag
  async delete(id: string) {
    return db.delete(tags).where(eq(tags.id, id));
  },

  // Get tags with link count
  async getTagsWithLinkCount(userId: string) {
    const result = await db
      .select({
        tag: tags,
        linkCount: count(linksTags.id),
      })
      .from(tags)
      .leftJoin(linksTags, eq(linksTags.tagId, tags.id))
      .where(eq(tags.userId, userId))
      .groupBy(tags.id)
      .orderBy(desc(count(linksTags.id)));

    return result.map(({ tag, linkCount }) => ({
      ...tag,
      linkCount,
    }));
  },

  // Search tags
  async search(userId: string, query: string) {
    return db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), like(tags.name, `%${query}%`)))
      .orderBy(asc(tags.name));
  },

  // Get or create tag
  async getOrCreate(name: string, userId: string, isAiGenerated = false) {
    const existingTag = await this.getByName(name, userId);
    if (existingTag) return existingTag;

    return this.create({
      name,
      userId,
      isAiGenerated,
    });
  },

  // Add tag to link
  async addTagToLink(tagId: string, linkId: string, confidence?: number) {
    const existing = await db
      .select()
      .from(linksTags)
      .where(and(eq(linksTags.tagId, tagId), eq(linksTags.linkId, linkId)));

    if (existing.length > 0) return existing[0];

    // Convert the confidence number to a string if it exists
    const result = await db
      .insert(linksTags)
      .values({
        tagId,
        linkId,
        // Cast the confidence to string to match the expected type
        confidence: confidence !== undefined ? confidence.toString() : null,
      })
      .returning();

    return result[0];
  },

  // Remove tag from link
  async removeTagFromLink(tagId: string, linkId: string) {
    return db
      .delete(linksTags)
      .where(and(eq(linksTags.tagId, tagId), eq(linksTags.linkId, linkId)));
  },

  // Get tags for a link
  async getTagsForLink(linkId: string) {
    return db
      .select({
        tag: tags,
        confidence: linksTags.confidence,
      })
      .from(linksTags)
      .innerJoin(tags, eq(linksTags.tagId, tags.id))
      .where(eq(linksTags.linkId, linkId))
      .orderBy(desc(linksTags.confidence));
  },

  // Get links for a tag
  async getLinksForTag(tagId: string, limit = 20, offset = 0) {
    return db
      .select({
        link: links,
      })
      .from(linksTags)
      .innerJoin(links, eq(linksTags.linkId, links.id))
      .where(eq(linksTags.tagId, tagId))
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Get AI-generated tags for a user
  async getAiGeneratedTags(userId: string) {
    return db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), eq(tags.isAiGenerated, true)))
      .orderBy(asc(tags.name));
  },

  // Create multiple tags at once (for AI tagging)
  async createBatch(
    tagData: Array<{
      name: string;
      userId: string;
      isAiGenerated?: boolean;
      color?: string;
    }>
  ) {
    if (tagData.length === 0) return [];
    const result = await db.insert(tags).values(tagData).returning();
    return result;
  },
};
