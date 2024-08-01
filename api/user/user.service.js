import { dbService } from '../../services/db.service.js';
import { logger } from '../../services/logger.service.js';
import { reviewService } from '../review/review.service.js';
import { ObjectId } from 'mongodb';

export const userService = {
    add, // Create (Signup)
    getById, // Read (Profile page)
    update, // Update (Edit profile)
    remove, // Delete (remove user)
    query, // List (of users)
    getByUsername, // Used for Login
    getByFullname,
};

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy);
    try {
        const collection = await dbService.getCollection('user');
        var users = await collection.find(criteria).toArray();
        users = users.map(user => {
            delete user.password;
            user.createdAt = user._id.getTimestamp();
            return user;
        });
        return users;
    } catch (err) {
        logger.error('cannot find users', err);
        throw err;
    }
}

async function getById(userId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) };
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne(criteria);
        delete user.password;

        criteria = { byUserId: userId };
        user.givenReviews = await reviewService.query(criteria);
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser;
            return review;
        });

        return user;
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err);
        throw err;
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ username });
        return user;
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err);
        throw err;
    }
}


async function getByFullname(fullname) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ fullname });
        return user;
    } catch (err) {
        logger.error(`while finding user by fullname: ${fullname}`, err);
        throw err;
    }
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) };
        const collection = await dbService.getCollection('user');
        await collection.deleteOne(criteria);
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err);
        throw err;
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id),
            fullname: user.fullname,
            score: user.score,
        };
        const collection = await dbService.getCollection('user');
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err);
        throw err;
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin,
            score: 100,
        };
        const collection = await dbService.getCollection('user');
        await collection.insertOne(userToAdd);
        return userToAdd;
    } catch (err) {
        logger.error('cannot add user', err);
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' };
        criteria.$or = [
            { username: txtCriteria },
            { fullname: txtCriteria },
        ];
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance };
    }
    return criteria;
}
