class NibssError extends Error {
    constructor(message, statusCode = 500, data = null) {
        super(message);

        this.name = 'NibssError';
        this.statusCode = statusCode;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

function createNibssError(error) {
    if (!error) {
        return new NibssError('Unknown NIBSS error');
    }

    if (error.response) {
        const statusCode = error.response.status;

        const responseData = error.response.data;

        const message =
            responseData?.message ||
            responseData?.error ||
            error.message ||
            'NIBSS API request failed';

        return new NibssError(
            message,
            statusCode,
            responseData
        );
    }

    if (error.request) {
        return new NibssError(
            'No response received from NIBSS API',
            503,
            null
        );
    }

    return new NibssError(
        error.message || 'NIBSS request failed',
        500,
        null
    );
}

module.exports = {
    NibssError,
    createNibssError
};