import { db } from '../../config/db.js';
import { auctions } from '../../drizzle/schema.js';
import { ApiError } from '../../utils/ApiError.js';
import { eq } from 'drizzle-orm';
import type { CreateAuctionInput } from './auctions.validation.js';

export const createAuction = async (data: CreateAuctionInput, adminId: string) => {
  const result = await db
    .insert(auctions)
    .values({
      title: data.title,
      startPrice: data.startPrice.toString(),
      currentPrice: data.startPrice.toString(),
      status: 'PENDING',
      startTime: data.startTime ? new Date(data.startTime) : null,
      endTime: data.endTime ? new Date(data.endTime) : null,
      createdBy: adminId,
    })
    .returning();

  return result[0];
};

export const getAllAuctions = async () => {
  return db.select().from(auctions);
};

export const updateAuctionStatus = async (auctionId: string, status: 'ACTIVE' | 'CLOSED') => {
  const existing = await db.select().from(auctions).where(eq(auctions.id, auctionId));

  const auction = existing[0];

  if (!auction) {
    throw new ApiError(404, 'Auction not found');
  }

  if (auction.status === 'CLOSED') {
    throw new ApiError(409, 'Auction already closed');
  }

  if (auction.status === 'PENDING' && status === 'CLOSED') {
    throw new ApiError(409, 'Cannot directly close a pending auction');
  }

  const updated = await db
    .update(auctions)
    .set({ status })
    .where(eq(auctions.id, auctionId))
    .returning();

  return updated[0];
};
