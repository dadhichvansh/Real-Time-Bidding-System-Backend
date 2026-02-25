import { Router } from 'express';
import { create, getAll, updateStatus } from './auctions.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';

const router = Router();

router.get('/', requireAuth, getAll);
router.post('/', requireAuth, requireRole('ADMIN'), create);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), updateStatus);

export default router;
