import { logger } from '../../services/logger.service.js';
import { orderService } from './order.service.js';

export async function getOrders(req, res) {
    try {
        const orders = await orderService.query();
        res.json(orders);
    } catch (err) {
        logger.error('Failed to get orders', err);
        res.status(400).send({ err: 'Failed to get orders' });
    }
}

export async function getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId);
        
        // Check if the user is authorized to access this order
        if (order.buyer._id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).send({ err: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (err) {
        logger.error('Failed to get order', err);
        res.status(400).send({ err: 'Failed to get order' });
    }
}

export async function addOrder(req, res) {
    try {
        const order = { ...req.body, buyer: req.user }; // Attach user info to the order
        const addedOrder = await orderService.add(order);
        res.json(addedOrder);
    } catch (err) {
        logger.error('Failed to add order', err);
        res.status(400).send({ err: 'Failed to add order' });
    }
}

export async function updateOrder(req, res) {
    try {
        const orderId = req.params.id;
        const { status } = req.body; // Destructure status from req.body
        const order = await orderService.getById(orderId);

        if (!order) {
            return res.status(404).send({ err: 'Order not found' });
        }  if (order.buyer._id !== req.user._id && 
            order.owner.fullname !== req.user.fullname && 
            !req.user.isAdmin) {
            return res.status(403).send({ err: 'Not authorized to update this order' });
        }
        

        const updatedOrder = await orderService.update(orderId, status);
        res.json(updatedOrder);
    } catch (err) {
        logger.error('Failed to update order', err);
        res.status(400).send({ err: 'Failed to update order' });
    }
}

export async function removeOrder(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId);

        // Check if the user is authorized to delete this order
        if (order.buyer._id !== req.user._id && !req.user.isAdmin) {
            return res.status(403).send({ err: 'Not authorized to delete this order' });
        }

        const removedId = await orderService.remove(orderId);
        res.send(removedId);
    } catch (err) {
        logger.error('Failed to remove order', err);
        res.status(400).send({ err: 'Failed to remove order' });
    }
}
