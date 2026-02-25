import { db } from '../../config/db.js';
import { auctions, bids } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '../../utils/ApiError.js';
import type { PlaceBidInput } from './bids.validation.js';
import { io } from '../../websocket/socket.js';

export const placeBid = async (data: PlaceBidInput, dealerId: string) => {
  const result = await db.transaction(async (tx) => {
    const auctionResult = await tx
      .select()
      .from(auctions)
      .where(eq(auctions.id, data.auctionId))
      .for('update');

    const auction = auctionResult[0];

    if (!auction) {
      throw new ApiError(404, 'Auction not found');
    }

    const now = new Date();

    if (auction.endTime && auction.endTime < now) {
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

    await tx
      .update(auctions)
      .set({ currentPrice: incomingBid.toString() })
      .where(eq(auctions.id, data.auctionId));

    await tx.insert(bids).values({
      auctionId: data.auctionId,
      dealerId,
      amount: incomingBid.toString(),
    });

    return {
      auctionId: data.auctionId,
      newPrice: incomingBid,
    };
  });

  // 🔥 EMIT AFTER COMMIT
  io.to(result.auctionId).emit('bid:update', {
    auctionId: result.auctionId,
    newPrice: result.newPrice,
  });

  return {
    message: 'Bid placed successfully',
    newPrice: result.newPrice,
  };
};
