import { logger } from '../../services/logger.service.js'
import { orderService } from './order.service.js'

export async function getOrders(req, res) {
    try {
        const filterBy = {
            status: req.query.status || '',
            userId: req.query.userId || ''
        }
        const orders = await orderService.query(filterBy)
        res.json(orders)
    } catch (err) {
        logger.error('Failed to get orders', err)
        res.status(400).send({ err: 'Failed to get orders' })
    }
}

export async function getOrderById(req, res) {
    try {
        const orderId = req.params.id
        const order = await orderService.getById(orderId)
        res.json(order)
    } catch (err) {
        logger.error('Failed to get order', err)
        res.status(400).send({ err: 'Failed to get order' })
    }
}

export async function addOrder(req, res) {
    try {
        const { loggedinUser, body: order } = req
        order.buyer = loggedinUser
        const addedOrder = await orderService.add(order)
        res.json(addedOrder)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(400).send({ err: 'Failed to add order' })
    }
}

export async function updateOrder(req, res) {
    try {
        const { loggedinUser, body: order } = req
        const { _id: userId, isAdmin } = loggedinUser

        if (!isAdmin && order.buyer._id !== userId) {
            res.status(403).send('Not your order...')
            return
        }

        const updatedOrder = await orderService.update(order)
        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(400).send({ err: 'Failed to update order' })
    }
}

export async function removeOrder(req, res) {
    try {
        const orderId = req.params.id
        const removedId = await orderService.remove(orderId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove order', err)
        res.status(400).send({ err: 'Failed to remove order' })
    }
}
