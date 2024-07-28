import express from 'express';
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { log } from '../../middlewares/logger.middleware.js';
import { 
    getGigs, getGigById, addGig, updateGig, removeGig,
    addGigMsg, removeGigMsg 
} from './gig.controller.js';

const router = express.Router();

// Protected Routes (require authentication)
// router.use(requireAuth); // Apply requireAuth to all subsequent routes

router.get('/', log, getGigs);
router.get('/:id', log, getGigById);
router.post('/', log, addGig);      // requireAuth already applied
router.put('/:id', log, updateGig);  // requireAuth already applied
router.delete('/:id', log, removeGig); // requireAuth already applied

router.post('/:id/msg', log, addGigMsg);     // requireAuth already applied
router.delete('/:id/msg/:msgId', log, removeGigMsg); // requireAuth already applied

export const gigRoutes = router;











// import express from 'express'
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
// import { log } from '../../middlewares/logger.middleware.js'

// import { getGigs, getGigById, addGig, updateGig, removeGig, addGigMsg, removeGigMsg } from './gig.controller.js'

// const router = express.Router()

// router.get('/', log, getGigs)
// router.get('/:id', log, getGigById)
// router.post('/', log, requireAuth, addGig)
// router.put('/:id', requireAuth, updateGig)
// router.delete('/:id', requireAuth, removeGig)

// router.post('/:id/msg', requireAuth, addGigMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeGigMsg)

// export const gigRoutes = router
