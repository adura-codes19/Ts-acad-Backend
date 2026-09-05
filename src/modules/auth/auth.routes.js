const express = require('express');

const router =
    express.Router();

const authController =
    require('./auth.controller');

const validate =
    require('../../middleware/validate.middleware');

const authValidation =
    require('./auth.validation');


/**
 * Authenticate fintech with NIBSS.
 *
 * POST /api/auth/token
 *
 * This route does NOT use
 * authMiddleware because its purpose
 * is to obtain the JWT token.
 */
router.post(
    '/token',
    validate(
        authValidation.login
    ),
    authController.login
);


/**
 * Validate NIBSS JWT.
 *
 * POST /api/auth/validate-token
 */
router.post(
    '/validate-token',
    validate(
        authValidation.token
    ),
    authController.validateToken
);


module.exports =
    router;