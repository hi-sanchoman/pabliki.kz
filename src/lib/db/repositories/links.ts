import { db } from '..';
import { tags, links, notes, collections, linksTags, linkCollections } from '..';
import { eq, and, like, desc, asc, inArray, count } from 'drizzle-orm';

export interface LinkWithRelations extends Partial<typeof links.$inferSelect> {
  tags?: Partial<typeof tags.$inferSelect>[];
  collections?: Partial<typeof collections.$inferSelect>[];
  notes?: Partial<typeof notes.$inferSelect>[];
}

export const linksRepository = {
  // Get all links for a user
  async getAllByUserId(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
      isArchived?: boolean;
      isFavorite?: boolean;
    }
  ) {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      isArchived,
      isFavorite,
    } = options || {};

    // Build conditions
    const whereConditions = [];
    whereConditions.push(eq(links.userId, userId));

    if (typeof isArchived === 'boolean') {
      whereConditions.push(eq(links.isArchived, isArchived));
    }

    if (typeof isFavorite === 'boolean') {
      whereConditions.push(eq(links.isFavorite, isFavorite));
    }

    // Apply all conditions and sorting
    if (sortBy === 'createdAt') {
      if (sortDirection === 'asc') {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(asc(links.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(desc(links.createdAt))
          .limit(limit)
          .offset(offset);
      }
    } else if (sortBy === 'updatedAt') {
      if (sortDirection === 'asc') {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(asc(links.updatedAt))
          .limit(limit)
          .offset(offset);
      } else {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(desc(links.updatedAt))
          .limit(limit)
          .offset(offset);
      }
    } else if (sortBy === 'title') {
      if (sortDirection === 'asc') {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(asc(links.title))
          .limit(limit)
          .offset(offset);
      } else {
        return db
          .select()
          .from(links)
          .where(and(...whereConditions))
          .orderBy(desc(links.title))
          .limit(limit)
          .offset(offset);
      }
    } else {
      // Default sort by createdAt desc
      return db
        .select()
        .from(links)
        .where(and(...whereConditions))
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset);
    }
  },

  // Get link by ID with related data
  async getById(id: string, includeRelations = false): Promise<LinkWithRelations | null> {
    const result = await db.select().from(links).where(eq(links.id, id));
    const link = result[0] || null;

    if (!link || !includeRelations) return link;

    // Get related tags
    const linkTags = await db
      .select({
        tag: tags,
        confidence: linksTags.confidence,
      })
      .from(linksTags)
      .innerJoin(tags, eq(linksTags.tagId, tags.id))
      .where(eq(linksTags.linkId, id));

    // Get related collections
    const linkCollectionsResult = await db
      .select({
        collection: collections,
      })
      .from(linkCollections)
      .innerJoin(collections, eq(linkCollections.collectionId, collections.id))
      .where(eq(linkCollections.linkId, id));

    // Get notes
    const linkNotes = await db.select().from(notes).where(eq(notes.linkId, id));

    return {
      ...link,
      tags: linkTags.map((lt) => lt.tag),
      collections: linkCollectionsResult.map((lc) => lc.collection),
      notes: linkNotes,
    };
  },

  // Get link by URL for a specific user
  async getByUrl(url: string, userId: string) {
    const result = await db
      .select()
      .from(links)
      .where(and(eq(links.url, url), eq(links.userId, userId)));
    return result[0] || null;
  },

  // Create a new link
  async create(data: {
    url: string;
    title: string;
    description?: string;
    image?: string;
    favicon?: string;
    siteName?: string;
    content?: string;
    userId: string;
    metadata?: Record<string, unknown>;
    tagIds?: string[];
    collectionIds?: string[];
  }) {
    const { tagIds, collectionIds, ...linkData } = data;

    // Create the link
    const result = await db.insert(links).values(linkData).returning();
    const newLink = result[0];

    if (!newLink) throw new Error('Failed to create link');

    // Associate with tags if provided
    if (tagIds && tagIds.length > 0) {
      await db.insert(linksTags).values(
        tagIds.map((tagId) => ({
          linkId: newLink.id,
          tagId,
        }))
      );
    }

    // Associate with collections if provided
    if (collectionIds && collectionIds.length > 0) {
      await db.insert(linkCollections).values(
        collectionIds.map((collectionId) => ({
          linkId: newLink.id,
          collectionId,
        }))
      );
    }

    return newLink;
  },

  // Update a link
  async update(id: string, data: Partial<typeof links.$inferInsert>) {
    const result = await db
      .update(links)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return result[0];
  },

  // Toggle favorite status
  async toggleFavorite(id: string, userId: string) {
    const link = await this.getById(id);
    if (!link || link.userId !== userId) throw new Error('Link not found or access denied');

    return this.update(id, { isFavorite: !link.isFavorite });
  },

  // Toggle archive status
  async toggleArchive(id: string, userId: string) {
    const link = await this.getById(id);
    if (!link || link.userId !== userId) throw new Error('Link not found or access denied');

    return this.update(id, { isArchived: !link.isArchived });
  },

  // Delete a link
  async delete(id: string) {
    return db.delete(links).where(eq(links.id, id));
  },

  // Search links
  async search(
    userId: string,
    query: string,
    options?: {
      limit?: number;
      offset?: number;
      includeArchived?: boolean;
      tagIds?: string[];
      collectionIds?: string[];
    }
  ) {
    const {
      limit = 20,
      offset = 0,
      includeArchived = false,
      tagIds = [],
      collectionIds = [],
    } = options || {};

    // Build base conditions
    const baseConditions = [eq(links.userId, userId), like(links.title, `%${query}%`)];

    if (!includeArchived) {
      baseConditions.push(eq(links.isArchived, false));
    }

    // If both tag and collection filters are applied, we need to handle this case separately
    if (tagIds.length > 0 && collectionIds.length > 0) {
      // First get links with tags
      const linksWithTags = await db
        .select({ id: links.id })
        .from(links)
        .innerJoin(linksTags, eq(links.id, linksTags.linkId))
        .where(and(...baseConditions, inArray(linksTags.tagId, tagIds)));

      const linkIdsWithTags = linksWithTags.map((l) => l.id);

      if (linkIdsWithTags.length === 0) {
        return [];
      }

      // Then filter those links by collections
      return db
        .select()
        .from(links)
        .innerJoin(linkCollections, eq(links.id, linkCollections.linkId))
        .where(
          and(
            ...baseConditions,
            inArray(links.id, linkIdsWithTags),
            inArray(linkCollections.collectionId, collectionIds)
          )
        )
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset);
    }

    // If only tag filter is applied
    if (tagIds.length > 0) {
      return db
        .select()
        .from(links)
        .innerJoin(linksTags, eq(links.id, linksTags.linkId))
        .where(and(...baseConditions, inArray(linksTags.tagId, tagIds)))
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset);
    }

    // If only collection filter is applied
    if (collectionIds.length > 0) {
      return db
        .select()
        .from(links)
        .innerJoin(linkCollections, eq(links.id, linkCollections.linkId))
        .where(and(...baseConditions, inArray(linkCollections.collectionId, collectionIds)))
        .orderBy(desc(links.createdAt))
        .limit(limit)
        .offset(offset);
    }

    // No filters - just apply base conditions
    return db
      .select()
      .from(links)
      .where(and(...baseConditions))
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Get links stats for a user
  async getUserStats(userId: string) {
    const totalLinks = await db
      .select({ count: count() })
      .from(links)
      .where(eq(links.userId, userId));

    const favoriteLinks = await db
      .select({ count: count() })
      .from(links)
      .where(and(eq(links.userId, userId), eq(links.isFavorite, true)));

    const archivedLinks = await db
      .select({ count: count() })
      .from(links)
      .where(and(eq(links.userId, userId), eq(links.isArchived, true)));

    return {
      total: totalLinks[0]?.count || 0,
      favorites: favoriteLinks[0]?.count || 0,
      archived: archivedLinks[0]?.count || 0,
    };
  },

  // Update a link's last visited timestamp
  async updateLastVisited(id: string) {
    return db.update(links).set({ lastVisited: new Date() }).where(eq(links.id, id));
  },
};
