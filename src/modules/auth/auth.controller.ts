import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { loginUser, registerUser } from './auth.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { env } from '../../config/env.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validated = registerSchema.safeParse(req.body);

  if (!validated.success) {
    throw new ApiError(400, 'Please enter valid credentials');
  }

  const user = await registerUser(validated.data);

  res.status(201).json(new ApiResponse(201, 'User registered successfully', user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validated = loginSchema.safeParse(req.body);

  if (!validated.success) {
    throw new ApiError(400, 'Please enter valid credentials');
  }

  const result = await loginUser(validated.data);

  res
    .status(200)
    .cookie('token', result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    })
    .json(new ApiResponse(200, 'Login successful', result));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    })
    .json(new ApiResponse(200, 'Logged out successfully'));
});
