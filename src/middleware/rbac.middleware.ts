import type { NextFunction, Response } from 'express';
import type { AuthRequest } from './auth.middleware.js';
import { ApiError } from '../utils/ApiError.js';

export const requireRole =
  (...roles: ('ADMIN' | 'DEALER')[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
