import { config } from '../config/index.js';
import { logger } from '../services/logger.service.js';
import { asyncLocalStorage } from '../services/als.service.js';

export function requireAuth(req, res, next) {
    const store = asyncLocalStorage.getStore();
    const loggedinUser = store ? store.loggedinUser : null;

    if (config.isGuestMode && !loggedinUser) {
        req.user = { _id: '', fullname: 'Guest' };
        return next();
    }
    if (!loggedinUser) return res.status(401).send('Not Authenticated');

    req.user = loggedinUser; // Attach user info to the request object
    next();
}

export function requireAdmin(req, res, next) {
    const store = asyncLocalStorage.getStore();
    const loggedinUser = store ? store.loggedinUser : null;

    if (!loggedinUser) return res.status(401).send('Not Authenticated');
    if (!loggedinUser.isAdmin) {
        logger.warn(`${loggedinUser.fullname} attempted to perform admin action`);
        return res.status(403).send('Not Authorized');
    }
    req.user = loggedinUser; // Attach user info to the request object
    next();
}
