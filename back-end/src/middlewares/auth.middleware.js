const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response.util');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'UNAUTHORIZED', 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gắn thông tin (userId, role) vào request để các controller sau dùng
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 'TOKEN_EXPIRED', 'Token has expired', 401);
        }
        return errorResponse(res, 'INVALID_TOKEN', 'Invalid token', 401);
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
    }
    next();
};

const verifyAdminOrStaff = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'staff')) {
        return errorResponse(res, 'FORBIDDEN', 'Access denied. Admin or Staff only', 403);
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyAdminOrStaff
};