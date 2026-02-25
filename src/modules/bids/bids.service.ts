import { db } from '../../config/db.js';
import { auctions, bids } from '../../drizzle/schema.js';
import { eq, sql } from 'drizzle-orm';
import { ApiError } from '../../utils/ApiError.js';
import type { PlaceBidInput } from './bids.validation.js';

export const placeBid = async (data: PlaceBidInput, dealerId: string) => {
  return db.transaction(async (tx) => {
    // 🔒 Lock auction row
    const result = await tx
      .select()
      .from(auctions)
      .where(eq(auctions.id, data.auctionId))
      .for('update');

    const auction = result[0];

    if (!auction) {
      throw new ApiError(404, 'Auction not found');
    }

    // 🔥 AUTO-CLOSE CHECK
    if (auction.endTime && auction.endTime < new Date()) {
      await tx.update(auctions).set({ status: 'CLOSED' }).where(eq(auctions.id, data.auctionId));

      throw new ApiError(400, 'Auction has ended');
    }

    if (auction.status !== 'ACTIVE') {
      throw new ApiError(400, 'Auction is not active');
    }

    const currentPrice = Number(auction.currentPrice);
    const incomingBid = data.amount;

    if (incomingBid <= currentPrice) {
      throw new ApiError(400, 'Bid must be greater than current price');
    }

    // Update auction price
    await tx
      .update(auctions)
      .set({
        currentPrice: incomingBid.toString(),
      })
      .where(eq(auctions.id, data.auctionId));

    // Insert bid record
    await tx.insert(bids).values({
      auctionId: data.auctionId,
      dealerId,
      amount: incomingBid.toString(),
    });

    return {
      message: 'Bid placed successfully',
      newPrice: incomingBid,
    };
  });
};
