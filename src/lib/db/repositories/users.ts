import { db } from '..';
import { users } from '..';
import { eq } from 'drizzle-orm';

export const usersRepository = {
  // Get all users
  async getAll() {
    return db.select().from(users);
  },

  // Get user by ID
  async getById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  // Get user by email
  async getByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  },

  // Create a new user
  async create(data: { name?: string; email: string; password?: string; image?: string }) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  // Update a user
  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  },

  // Delete a user
  async delete(id: string) {
    return db.delete(users).where(eq(users.id, id));
  },
};
