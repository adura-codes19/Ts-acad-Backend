const express = require('express');

const router =
    express.Router();

const transactionController =
    require('./transaction.controller');

const authMiddleware =
    require('../../middleware/auth.middleware');

const validate =
    require('../../middleware/validate.middleware');

const transactionValidation =
    require('./transaction.validation');


/**
 * Initiate transfer
 *
 * POST /api/transactions/transfer
 */
router.post(
    '/transfer',
    authMiddleware,
    validate(
        transactionValidation.transfer
    ),
    transactionController.transfer
);


/**
 * Transaction Status Query
 *
 * GET /api/transactions/:transactionId
 */
router.get(
    '/:transactionId',
    authMiddleware,
    transactionController.getStatus
);


module.exports = router;