import { db } from '..';
import { collections, linkCollections, links } from '..';

import { eq, and, like, isNull, desc, asc, count } from 'drizzle-orm';

export const collectionsRepository = {
  // Get all root collections for a user (no parent)
  async getRootCollections(userId: string) {
    return db
      .select()
      .from(collections)
      .where(and(eq(collections.userId, userId), isNull(collections.parentId)))
      .orderBy(asc(collections.name));
  },

  // Get all collections for a user
  async getAllByUserId(userId: string) {
    return db
      .select()
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(asc(collections.name));
  },

  // Get collection by ID
  async getById(id: string) {
    const result = await db.select().from(collections).where(eq(collections.id, id));
    return result[0] || null;
  },

  // Get children collections for a parent
  async getChildren(parentId: string) {
    return db
      .select()
      .from(collections)
      .where(eq(collections.parentId, parentId))
      .orderBy(asc(collections.name));
  },

  // Get collections with link count
  async getCollectionsWithLinkCount(userId: string) {
    const result = await db
      .select({
        collection: collections,
        linkCount: count(linkCollections.id),
      })
      .from(collections)
      .leftJoin(linkCollections, eq(linkCollections.collectionId, collections.id))
      .where(eq(collections.userId, userId))
      .groupBy(collections.id)
      .orderBy(asc(collections.name));

    return result.map(({ collection, linkCount }) => ({
      ...collection,
      linkCount,
    }));
  },

  // Create a new collection
  async create(data: {
    name: string;
    userId: string;
    description?: string;
    color?: string;
    icon?: string;
    isPrivate?: boolean;
    parentId?: string | null;
  }) {
    const result = await db.insert(collections).values(data).returning();
    return result[0];
  },

  // Update a collection
  async update(id: string, data: Partial<typeof collections.$inferInsert>) {
    const result = await db
      .update(collections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(collections.id, id))
      .returning();
    return result[0];
  },

  // Delete a collection
  async delete(id: string) {
    // First, get all child collections
    const children = await this.getChildren(id);

    // Recursively delete all children
    for (const child of children) {
      await this.delete(child.id);
    }

    // Delete links associations
    await db.delete(linkCollections).where(eq(linkCollections.collectionId, id));

    // Delete the collection itself
    return db.delete(collections).where(eq(collections.id, id));
  },

  // Search collections
  async search(userId: string, query: string) {
    return db
      .select()
      .from(collections)
      .where(and(eq(collections.userId, userId), like(collections.name, `%${query}%`)))
      .orderBy(asc(collections.name));
  },

  // Add link to collection
  async addLink(collectionId: string, linkId: string) {
    const existing = await db
      .select()
      .from(linkCollections)
      .where(
        and(eq(linkCollections.collectionId, collectionId), eq(linkCollections.linkId, linkId))
      );

    if (existing.length > 0) return existing[0];

    const result = await db
      .insert(linkCollections)
      .values({
        collectionId,
        linkId,
      })
      .returning();

    return result[0];
  },

  // Remove link from collection
  async removeLink(collectionId: string, linkId: string) {
    return db
      .delete(linkCollections)
      .where(
        and(eq(linkCollections.collectionId, collectionId), eq(linkCollections.linkId, linkId))
      );
  },

  // Get links in collection
  async getLinks(collectionId: string, limit = 20, offset = 0) {
    return db
      .select({
        link: links,
      })
      .from(linkCollections)
      .innerJoin(links, eq(linkCollections.linkId, links.id))
      .where(eq(linkCollections.collectionId, collectionId))
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Move collection to a new parent
  async moveToParent(collectionId: string, newParentId: string | null) {
    // Prevent circular references - check if newParentId is not a descendant of collectionId
    if (newParentId) {
      let currentCollection = await this.getById(newParentId);
      while (currentCollection && currentCollection.parentId) {
        if (currentCollection.parentId === collectionId) {
          throw new Error('Cannot move a collection to its own descendant');
        }
        currentCollection = await this.getById(currentCollection.parentId);
      }
    }

    return this.update(collectionId, { parentId: newParentId });
  },

  // Get full path of a collection (breadcrumb)
  async getPath(collectionId: string): Promise<(typeof collections.$inferSelect)[]> {
    const collection = await this.getById(collectionId);
    if (!collection) return [];

    if (!collection.parentId) return [collection];

    const parentPath = await this.getPath(collection.parentId);
    return [...parentPath, collection];
  },

  // Get collections that contain a specific link
  async getCollectionsForLink(linkId: string, userId: string) {
    return db
      .select({
        collection: collections,
      })
      .from(linkCollections)
      .innerJoin(collections, eq(linkCollections.collectionId, collections.id))
      .where(and(eq(linkCollections.linkId, linkId), eq(collections.userId, userId)))
      .orderBy(asc(collections.name));
  },
};
