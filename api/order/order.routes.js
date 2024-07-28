import express from 'express';
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { log } from '../../middlewares/logger.middleware.js';
import { getOrders, getOrderById, addOrder, updateOrder, removeOrder } from './order.controller.js';

const router = express.Router();

// router.use(requireAuth); // Apply requireAuth to all subsequent routes

router.get('/', log, getOrders);
router.get('/:id', log, getOrderById);
router.post('/', log, addOrder);  
router.put('/:id', log, updateOrder); 
router.delete('/:id', log, removeOrder); 

export const orderRoutes = router;




// import express from 'express'
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
// import { log } from '../../middlewares/logger.middleware.js'

// import { getOrders, getOrderById, addOrder, updateOrder, removeOrder } from './order.controller.js'

// const router = express.Router()

// router.get('/', log, getOrders)
// router.get('/:id', log, getOrderById)
// router.post('/', log, requireAuth, addOrder)
// router.put('/:id', requireAuth, updateOrder)
// router.delete('/:id', requireAuth, removeOrder)

// export const orderRoutes = router
    