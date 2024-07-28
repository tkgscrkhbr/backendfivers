import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getReviews, getReviewById, getRandomReview, addReview, updateReview, deleteReview } from './review.controller.js'

const router = express.Router()

router.get('/', log, getRandomReview)
router.get('/all', log, getReviews)
router.get('/:id', log, getReviewById)
router.post('/', log, requireAuth, addReview)
router.put('/:id', log, requireAuth, updateReview)
router.delete('/:id', requireAuth, deleteReview)

export const reviewRoutes = router
