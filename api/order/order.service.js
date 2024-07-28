import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const orderService = {
    query,
    getById,
    add,
    update,
    remove
}

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        const orders = await collection.find(criteria).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(orderId) }
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne(criteria)
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(order._id) }
        const collection = await dbService.getCollection('order')
        await collection.updateOne(criteria, { $set: order })
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(orderId) }
        const collection = await dbService.getCollection('order')
        await collection.deleteOne(criteria)
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.status) criteria.status = filterBy.status
    if (filterBy.userId) criteria['buyer._id'] = ObjectId.createFromHexString(filterBy.userId)
    return criteria
}
