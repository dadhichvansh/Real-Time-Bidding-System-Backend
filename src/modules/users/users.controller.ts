import type { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { getAllUsers, getUserById, deleteUser } from './users.service.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await getUserById(req.user.id);

  res.status(200).json(new ApiResponse(200, 'User profile', user));
});

export const getAll = asyncHandler(async (_req, res: Response) => {
  const users = await getAllUsers();

  res.status(200).json(new ApiResponse(200, 'Users fetched', users));
});

export const getById = asyncHandler(async (req, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    throw new ApiError(400, 'User id required');
  }

  const user = await getUserById(id);

  res.status(200).json(new ApiResponse(200, 'User fetched', user));
});

export const remove = asyncHandler(async (req, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    throw new ApiError(400, 'User id required');
  }

  const user = await deleteUser(id);

  res.status(200).json(new ApiResponse(200, 'User deleted', user));
});
