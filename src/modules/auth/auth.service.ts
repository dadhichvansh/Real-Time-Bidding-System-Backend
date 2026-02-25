import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { users } from '../../drizzle/schema.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';

export const registerUser = async (data: {
  email: string;
  password: string;
  role: 'ADMIN' | 'DEALER';
}) => {
  const existingUser = await db.select().from(users).where(eq(users.email, data.email));

  if (existingUser.length > 0) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await argon2.hash(data.password);

  const newUser = await db
    .insert(users)
    .values({
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role,
    })
    .returning();

  return newUser[0];
};

export const loginUser = async (data: { email: string; password: string }) => {
  const result = await db.select().from(users).where(eq(users.email, data.email));

  if (!result.length) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const user = result[0];

  if (!user?.passwordHash) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const validPassword = await argon2.verify(user.passwordHash, data.password);

  if (!validPassword) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const payload: jwt.JwtPayload = {
    id: user.id,
    role: user.role,
  };

  const secret: jwt.Secret = env.JWT_SECRET;

  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  const token = jwt.sign(payload, secret, options);

  return { token };
};
