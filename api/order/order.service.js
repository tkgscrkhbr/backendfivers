import { ObjectId } from 'mongodb';
import { logger } from '../../services/logger.service.js';
import { dbService } from '../../services/db.service.js';

export const orderService = {
    query,
    getById,
    add,
    update,
    remove
};

async function query() {
    try {
        const collection = await dbService.getCollection('order');
        const orders = await collection.find().toArray();
        return orders;
    } catch (err) {
        logger.error('cannot find orders', err);
        throw err;
    }
}

async function getById(orderId) {
    try {
        const criteria = { _id: new ObjectId(orderId) };
        const collection = await dbService.getCollection('order');
        const order = await collection.findOne(criteria);
        return order;
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err);
        throw err;
    }
}
async function add(order) {
    try {
        const collection = await dbService.getCollection('order');
        await collection.insertOne(order);
        return order;
    } catch (err) {
        logger.error('cannot insert order', err);
        throw err;
    }
}


async function update(orderId, status) {
    try {
        const criteria = { _id: new ObjectId(orderId) };
        const collection = await dbService.getCollection('order');
        await collection.updateOne(criteria, { $set: { status } });
        return { ...await getById(orderId), status }; // Return updated order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err);
        throw err;
    }
}

async function remove(orderId) {
    try {
        const criteria = { _id: new ObjectId(orderId) };
        const collection = await dbService.getCollection('order');
        await collection.deleteOne(criteria);
        return orderId;
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err);
        throw err;
    }
}
