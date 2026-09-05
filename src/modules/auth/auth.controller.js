const authService =
    require('./auth.service');


/**
 * Login/authenticate fintech
 * with NIBSS.
 *
 * POST /api/auth/token
 */
async function login(
    req,
    res,
    next
) {
    try {
        const {
            apiKey,
            apiSecret
        } = req.body;

        const result =
            await authService.login(
                apiKey,
                apiSecret
            );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'NIBSS authentication successful',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


/**
 * Validate NIBSS token.
 *
 * POST /api/auth/validate-token
 */
async function validateToken(
    req,
    res,
    next
) {
    try {
        const authorization =
            req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith(
                'Bearer '
            )
        ) {
            return res
                .status(401)
                .json({
                    success: false,
                    message:
                        'Bearer token is required'
                });
        }

        const token =
            authorization
                .substring(7)
                .trim();

        const result =
            await authService
                .validateToken(
                    token
                );

        return res
            .status(200)
            .json({
                success: true,
                message:
                    'NIBSS token is valid',
                data: result
            });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    login,
    validateToken
};