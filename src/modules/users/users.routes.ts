import { Router } from 'express';
import { getMe, getAll, getById, remove } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMe);
router.get('/', requireAuth, requireRole('ADMIN'), getAll);
router.get('/:id', requireAuth, requireRole('ADMIN'), getById);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;
