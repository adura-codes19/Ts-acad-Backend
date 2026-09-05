const jwt = require('jsonwebtoken');

const {
    AppError
} = require('../utils/app-error');

/**
 * Authentication middleware.
 *
 * Expected header:
 *
 * Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
    try {
        const authorization =
            req.headers.authorization;

        if (!authorization) {
            throw new AppError(
                'Authorization header is required',
                401
            );
        }

        if (
            !authorization.startsWith('Bearer ')
        ) {
            throw new AppError(
                'Authorization header must use Bearer token',
                401
            );
        }

        const token =
            authorization.substring(7).trim();

        if (!token) {
            throw new AppError(
                'Access token is required',
                401
            );
        }

        const secret =
            process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                'JWT_SECRET is not configured'
            );
        }

        const decoded =
            jwt.verify(
                token,
                secret
            );

        /**
         * Make authenticated user
         * available to controllers/services.
         */
        req.user = decoded;

        /**
         * Continue request.
         */
        next();

    } catch (error) {

        if (
            error.name ===
            'TokenExpiredError'
        ) {
            return next(
                new AppError(
                    'Access token has expired',
                    401
                )
            );
        }

        if (
            error.name ===
            'JsonWebTokenError'
        ) {
            return next(
                new AppError(
                    'Invalid access token',
                    401
                )
            );
        }

        next(error);
    }
}

module.exports = authMiddleware;