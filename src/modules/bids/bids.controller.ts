import type { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { placeBidSchema } from './bids.validation.js';
import { placeBid } from './bids.service.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

export const place = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = placeBidSchema.safeParse(req.body);

  if (!validated.success) {
    throw new ApiError(400, 'Invalid input');
  }

  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await placeBid(validated.data, req.user.id);

  res.status(201).json(new ApiResponse(201, 'Bid placed', result));
});
