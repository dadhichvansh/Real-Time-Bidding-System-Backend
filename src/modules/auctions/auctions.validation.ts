import { z } from 'zod';

export const createAuctionSchema = z.object({
  title: z.string().min(3),
  startPrice: z.number().positive(),
  startTime: z.iso.datetime().optional(),
  endTime: z.iso.datetime().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'CLOSED']),
});

export type CreateAuctionInput = z.infer<typeof createAuctionSchema>;
