/**
 * Global error handling middleware.
 *
 * This middleware must be registered
 * AFTER all application routes.
 */
function errorMiddleware(
    err,
    req,
    res,
    next
) {
    console.error(
        'ERROR:',
        err
    );

    /**
     * Default error values.
     */
    let statusCode =
        err.statusCode || 500;

    let message =
        err.message ||
        'Internal server error';

    /**
     * Mongoose validation error.
     */
    if (
        err.name ===
        'ValidationError'
    ) {
        statusCode = 400;

        const errors =
            Object.values(
                err.errors
            ).map(
                (error) => error.message
            );

        return res.status(
            statusCode
        ).json({
            success: false,
            message:
                'Validation failed',
            errors
        });
    }

    /**
     * Mongoose duplicate key error.
     *
     * Example:
     * duplicate email,
     * duplicate BVN,
     * duplicate NIN,
     * duplicate account number.
     */
    if (
        err.code === 11000
    ) {
        statusCode = 409;

        const fields =
            Object.keys(
                err.keyPattern ||
                {}
            );

        return res.status(
            statusCode
        ).json({
            success: false,
            message:
                'Duplicate resource',
            fields
        });
    }

    /**
     * Mongoose invalid ObjectId.
     */
    if (
        err.name ===
        'CastError'
    ) {
        statusCode = 400;

        message =
            'Invalid resource identifier';
    }

    /**
     * NIBSS/API errors.
     *
     * If the integration layer attaches
     * response.status or response.statusCode,
     * preserve it.
     */
    if (
        err.response &&
        err.response.status
    ) {
        statusCode =
            err.response.status;

        if (
            err.response.data &&
            err.response.data.message
        ) {
            message =
                err.response.data.message;
        }
    }

    /**
     * Axios-style error.
     */
    if (
        err.response &&
        err.response.data
    ) {
        const nibssMessage =
            err.response.data.message;

        if (nibssMessage) {
            message =
                nibssMessage;
        }
    }

    /**
     * Never expose internal stack traces
     * in production.
     */
    const response = {
        success: false,
        message
    };

    /**
     * Include stack only during development.
     */
    if (
        process.env.NODE_ENV ===
        'development'
    ) {
        response.stack =
            err.stack;
    }

    return res
        .status(statusCode)
        .json(response);
}

module.exports =
    errorMiddleware;