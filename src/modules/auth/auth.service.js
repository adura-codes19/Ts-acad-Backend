const nibss =
    require('../../integrations/nibssByPhoenix');

const {
    AppError
} = require('../../utils/app-error');


/**
 * Authenticate the fintech with NIBSS.
 *
 * NIBSS:
 * POST /api/auth/token
 *
 * Request:
 * {
 *     "apiKey": "...",
 *     "apiSecret": "..."
 * }
 *
 * Response:
 * {
 *     "token": "...",
 *     "fintech": {
 *         "name": "...",
 *         "email": "...",
 *         "bankCode": "...",
 *         "bankName": "..."
 *     }
 * }
 */
async function login(
    apiKey,
    apiSecret
) {
    if (!apiKey) {
        throw new AppError(
            'API key is required',
            400
        );
    }

    if (!apiSecret) {
        throw new AppError(
            'API secret is required',
            400
        );
    }

    const response =
        await nibss.auth.login(
            apiKey,
            apiSecret
        );

    if (
        !response ||
        !response.token
    ) {
        throw new AppError(
            'NIBSS authentication failed',
            401
        );
    }

    return response;
}


/**
 * Validate that a NIBSS token exists
 * and has not expired.
 *
 * This is mainly useful before making
 * protected NIBSS requests.
 */
async function validateToken(
    token
) {
    if (!token) {
        throw new AppError(
            'NIBSS access token is required',
            401
        );
    }

    /**
     * NIBSS tokens are JWTs.
     *
     * We decode the payload here to check
     * the expiry locally.
     *
     * Actual authentication remains
     * the responsibility of NIBSS.
     */
    const parts =
        token.split('.');

    if (parts.length !== 3) {
        throw new AppError(
            'Invalid NIBSS access token',
            401
        );
    }

    try {
        const payload =
            JSON.parse(
                Buffer.from(
                    parts[1],
                    'base64url'
                ).toString('utf8')
            );

        if (
            payload.exp &&
            Date.now() >=
                payload.exp * 1000
        ) {
            throw new AppError(
                'NIBSS access token has expired',
                401
            );
        }

        return {
            valid: true,
            payload
        };

    } catch (error) {

        if (
            error instanceof AppError
        ) {
            throw error;
        }

        throw new AppError(
            'Invalid NIBSS access token',
            401
        );
    }
}


module.exports = {
    login,
    validateToken
};