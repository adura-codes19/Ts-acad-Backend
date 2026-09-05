const axios = require('axios');

const {
    AppError
} = require('../../utils/app-error');

const BASE_URL =
    process.env.NIBSS_BASE_URL;


/**
 * Authenticate with NIBSS.
 *
 * POST /api/auth/token
 */
async function login(
    apiKey,
    apiSecret
) {
    try {
        if (!BASE_URL) {
            throw new AppError(
                'NIBSS_BASE_URL is not configured',
                500
            );
        }

        const response =
            await axios.post(
                `${BASE_URL}/api/auth/token`,
                {
                    apiKey,
                    apiSecret
                },
                {
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    timeout: 30000
                }
            );

        return response.data;

    } catch (error) {

        if (
            error instanceof AppError
        ) {
            throw error;
        }

        if (error.response) {
            throw new AppError(
                error.response.data?.message ||
                'NIBSS authentication failed',
                error.response.status || 401
            );
        }

        throw new AppError(
            error.message ||
            'Unable to connect to NIBSS',
            502
        );
    }
}


module.exports = {
    login
};