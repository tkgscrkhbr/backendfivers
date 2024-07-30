import express from 'express';
import { log } from '../../middlewares/logger.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js';
import { getOrders, getOrderById, addOrder, updateOrder, removeOrder } from './order.controller.js';

const router = express.Router();

router.get('/', log, requireAuth, getOrders); // Apply requireAuth middleware
router.get('/:id', log, requireAuth, getOrderById); // Apply requireAuth middleware
router.post('/', log, requireAuth, addOrder); // Apply requireAuth middleware
router.put('/:id', log, requireAuth, updateOrder); // Apply requireAuth middleware
router.delete('/:id', log, requireAuth, removeOrder); // Apply requireAuth middleware

export const orderRoutes = router;
