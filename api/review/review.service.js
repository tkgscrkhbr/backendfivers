import { ObjectId } from 'mongodb'
import { asyncLocalStorage } from '../../services/als.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const reviewService = {
    query,
    getById,
    getRandom,
    remove,
    add,
    update,
}

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
      const reviews=collection

        return reviews
    } catch (err) {
        logger.error('Cannot get reviews', err)
        throw err
    }
}
async function getRandom() {
    try {
        const collection = await dbService.getCollection('review')
        const randomReview = await collection.aggregate([
            { $sample: { size: 1 } },
            { $lookup: { from: 'user', localField: 'byUserId', foreignField: '_id', as: 'byUser' } },
            { $unwind: '$byUser' },
            { $lookup: { from: 'user', localField: 'aboutUserId', foreignField: '_id', as: 'aboutUser' } },
            { $unwind: '$aboutUser' }
        ]).toArray()

        return randomReview.length ? randomReview[0] : null
    } catch (err) {
        logger.error('Cannot get random review', err)
        throw err
    }
}

async function getById(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const review = await collection.findOne({ _id: ObjectId(reviewId) })
        return review
    } catch (err) {
        logger.error(`Cannot find review ${reviewId}`, err)
        throw err
    }
}

async function remove(reviewId) {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const collection = await dbService.getCollection('review')
        const criteria = { _id: ObjectId(reviewId) }

        if (!loggedinUser.isAdmin) {
            criteria.byUserId = ObjectId(loggedinUser._id)
        }

        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`Cannot remove review ${reviewId}`, err)
        throw err
    }
}

async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: ObjectId(review.byUserId),
            aboutUserId: ObjectId(review.aboutUserId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        logger.error('Cannot add review', err)
        throw err
    }
}

async function update(review) {
    try {
        const collection = await dbService.getCollection('review')
        const criteria = { _id: ObjectId(review._id) }
        const update = { $set: { txt: review.txt } }
        await collection.updateOne(criteria, update)
        return review
    } catch (err) {
        logger.error(`Cannot update review ${review._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = ObjectId(filterBy.byUserId)
    if (filterBy.aboutUserId) criteria.aboutUserId = ObjectId(filterBy.aboutUserId)
    return criteria
}
