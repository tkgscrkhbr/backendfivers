import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { reviewService } from './review.service.js'

export async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}

export async function getReviewById(req, res) {
    const { id } = req.params
    try {
        const review = await reviewService.getById(id)
        res.send(review)
    } catch (err) {
        logger.error(`Cannot get review ${id}`, err)
        res.status(400).send({ err: 'Failed to get review' })
    }
}


export async function getRandomReview(req, res) {
    try {
        const review = await reviewService.getRandom()
        if (review) {
            res.send(review)
        } else {
            res.status(404).send({ err: 'No reviews found' })
        }
    } catch (err) {
        logger.error('Cannot get random review', err)
        res.status(400).send({ err: 'Failed to get random review' })
    }
}

export async function addReview(req, res) {
    const { loggedinUser } = req
    try {
        const review = req.body
        review.byUserId = loggedinUser._id
        const addedReview = await reviewService.add(review)

        loggedinUser.score += 10
        await userService.update(loggedinUser)
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        addedReview.byUser = loggedinUser
        socketService.broadcast({ type: 'review-added', data: addedReview, userId: loggedinUser._id })
        socketService.emitToUser({ type: 'review-about-you', data: addedReview, userId: review.aboutUserId })

        res.send(addedReview)
    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })
    }
}

export async function updateReview(req, res) {
    const { id } = req.params
    try {
        const review = { ...req.body, _id: id }
        const updatedReview = await reviewService.update(review)
        res.send(updatedReview)
    } catch (err) {
        logger.error('Failed to update review', err)
        res.status(400).send({ err: 'Failed to update review' })
    }
}

export async function deleteReview(req, res) {
    const { id } = req.params
    try {
        const deletedCount = await reviewService.remove(id)
        if (deletedCount === 1) {
            socketService.broadcast({ type: 'review-removed', data: id, userId: req.loggedinUser._id })
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        logger.error('Failed to delete review', err)
        res.status(400).send({ err: 'Failed to delete review' })
    }
}
