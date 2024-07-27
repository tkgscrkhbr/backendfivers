import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getGigs, getGigById, addGig, updateGig, removeGig, addGigMsg, removeGigMsg } from './gig.controller.js'

const router = express.Router()

router.get('/', log, getGigs)
router.get('/:id', log, getGigById)
router.post('/', log, requireAuth, addGig)
router.put('/:id', requireAuth, updateGig)
router.delete('/:id', requireAuth, removeGig)

router.post('/:id/msg', requireAuth, addGigMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeGigMsg)

export const gigRoutes = router
