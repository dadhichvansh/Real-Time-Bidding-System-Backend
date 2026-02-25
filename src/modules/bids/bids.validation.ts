import { z } from 'zod';

export const placeBidSchema = z.object({
  auctionId: z.uuid(),
  amount: z.number().positive(),
});

export type PlaceBidInput = z.infer<typeof placeBidSchema>;
