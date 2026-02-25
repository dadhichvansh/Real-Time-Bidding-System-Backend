import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { createAuction, getAllAuctions, updateAuctionStatus } from './auctions.service.js';
import { createAuctionSchema, updateStatusSchema } from './auctions.validation.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = createAuctionSchema.safeParse(req.body);

  if (!validated.success) {
    throw new ApiError(400, 'Invalid input');
  }

  const result = await createAuction(validated.data, req.user!.id);

  res.status(201).json(new ApiResponse(201, 'Auction created', result));
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const auctions = await getAllAuctions();

  res.status(200).json(new ApiResponse(200, 'Auctions fetched', auctions));
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    throw new ApiError(400, 'Auction id is required');
  }

  const validated = updateStatusSchema.safeParse(req.body);

  if (!validated.success) {
    throw new ApiError(400, 'Invalid input');
  }

  const result = await updateAuctionStatus(id, validated.data.status);

  res.status(200).json(new ApiResponse(200, 'Auction updated', result));
});
