import { db } from '..';
import { searchHistory } from '..';

import { eq, and, desc, count } from 'drizzle-orm';

export const searchHistoryRepository = {
  // Record a new search query
  async recordSearch(userId: string, query: string) {
    return db
      .insert(searchHistory)
      .values({
        userId,
        query,
      })
      .returning();
  },

  // Get user's recent searches
  async getRecentSearches(userId: string, limit = 10) {
    return db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
  },

  // Get most frequent searches for a user
  async getFrequentSearches(userId: string, limit = 10) {
    return db
      .select({
        query: searchHistory.query,
        count: count(),
      })
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .groupBy(searchHistory.query)
      .orderBy(desc(count()))
      .limit(limit);
  },

  // Clear search history for a user
  async clearHistory(userId: string) {
    return db.delete(searchHistory).where(eq(searchHistory.userId, userId));
  },

  // Delete a specific search query
  async deleteSearch(userId: string, id: string) {
    return db
      .delete(searchHistory)
      .where(and(eq(searchHistory.id, id), eq(searchHistory.userId, userId)));
  },
};
