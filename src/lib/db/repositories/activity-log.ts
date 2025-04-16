import { db } from '..';
import { activityLog, actionTypeEnum, users } from '..';

import { eq, desc, and, sql } from 'drizzle-orm';

// Action types - use the values defined in the schema
type ActionType = (typeof actionTypeEnum.enumValues)[number];

export const activityLogRepository = {
  // Log a user activity
  async logActivity(data: {
    userId: string;
    actionType: ActionType;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return db.insert(activityLog).values(data).returning();
  },

  // Get recent activities for a user
  async getRecentActivities(userId: string, limit = 20, offset = 0) {
    return db
      .select()
      .from(activityLog)
      .where(eq(activityLog.userId, userId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Get activities by type for a user
  async getActivitiesByType(userId: string, actionType: ActionType, limit = 20, offset = 0) {
    return db
      .select()
      .from(activityLog)
      .where(and(eq(activityLog.userId, userId), eq(activityLog.actionType, actionType)))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Get activities by date range for a user
  async getActivitiesByDateRange(userId: string, startDate: Date, endDate: Date) {
    return db
      .select()
      .from(activityLog)
      .where(
        and(
          eq(activityLog.userId, userId),
          sql`${activityLog.createdAt} BETWEEN ${startDate} AND ${endDate}`
        )
      )
      .orderBy(desc(activityLog.createdAt));
  },

  // Get activities for an entity
  async getActivitiesForEntity(entityId: string, limit = 20, offset = 0) {
    return db
      .select({
        activity: activityLog,
        user: users,
      })
      .from(activityLog)
      .innerJoin(users, eq(activityLog.userId, users.id))
      .where(eq(activityLog.entityId, entityId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit)
      .offset(offset);
  },

  // Delete activities older than a certain date
  async deleteOldActivities(date: Date) {
    return db.delete(activityLog).where(sql`${activityLog.createdAt} < ${date}`);
  },

  // Get activity frequency by type for analytics
  async getActivityFrequencyByType(userId: string, days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    // For complex SQL queries, use the raw SQL query feature with typed results
    type ActivityFrequencyResult = {
      action_type: string;
      count: number;
      date: Date;
    };

    const result = await db.execute<ActivityFrequencyResult>(sql`
      SELECT 
        action_type, 
        COUNT(*) as count,
        DATE_TRUNC('day', created_at) as date
      FROM activity_log
      WHERE 
        user_id = ${userId} AND
        created_at >= ${date}
      GROUP BY action_type, DATE_TRUNC('day', created_at)
      ORDER BY date DESC, count DESC
    `);

    return result;
  },
};
