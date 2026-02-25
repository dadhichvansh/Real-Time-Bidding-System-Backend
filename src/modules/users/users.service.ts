import { db } from '../../config/db.js';
import { users } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '../../utils/ApiError.js';

export const getAllUsers = async () => {
  return db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);
};

export const getUserById = async (userId: string) => {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  const user = result[0];

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const deleteUser = async (userId: string) => {
  const result = await db.delete(users).where(eq(users.id, userId)).returning();

  if (!result.length) {
    throw new ApiError(404, 'User not found');
  }

  return result[0];
};
