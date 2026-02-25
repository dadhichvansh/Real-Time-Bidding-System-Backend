import { Router } from 'express';
import { place } from './bids.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';

const router = Router();

router.post('/', requireAuth, requireRole('DEALER'), place);

export default router;
